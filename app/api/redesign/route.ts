import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";
import { redesignRoom, nearestAspectRatio } from "@/lib/fal";
import { getStyle } from "@/lib/styles";

export const runtime = "nodejs";
export const maxDuration = 60; // image generation can take a while

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const RATE_PER_MINUTE = 8; // per-user throttle

export async function POST(req: NextRequest) {
  const supabase = createClient();

  // 1) Auth guard — no anonymous access to the model.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Giriş yapmalısın." }, { status: 401 });
  }

  // 2) Simple per-user rate limit (defends the free API quota).
  const since = new Date(Date.now() - 60_000).toISOString();
  const { count } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .gte("created_at", since);
  if ((count ?? 0) >= RATE_PER_MINUTE) {
    return NextResponse.json(
      { error: "Çok hızlı gidiyorsun, bir dakika sonra tekrar dene." },
      { status: 429 }
    );
  }

  // 3) Parse + validate input.
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }
  const file = form.get("photo");
  const styleId = String(form.get("style") ?? "");
  const notes = String(form.get("notes") ?? "").slice(0, 300);

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Bir oda fotoğrafı yükle." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: "Sadece JPG, PNG veya WEBP yükleyebilirsin." },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Dosya 10MB'tan büyük olamaz." }, { status: 400 });
  }
  const style = getStyle(styleId);
  if (!style) {
    return NextResponse.json({ error: "Geçerli bir stil seç." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const base64 = bytes.toString("base64");
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const inputPath = `${user.id}/inputs/${crypto.randomUUID()}.${ext}`;

  // 4) Store the original (RLS makes this folder private to the user).
  const up1 = await supabase.storage.from("rooms").upload(inputPath, bytes, {
    contentType: file.type,
    upsert: false,
  });
  if (up1.error) {
    return NextResponse.json({ error: "Fotoğraf yüklenemedi." }, { status: 500 });
  }

  // 5) Call Gemini (structure-lock). Handle model failures gracefully.
  let output;
  try {
    // Keep the output framed like the user's room (avoids before/after drift).
    const roomMeta = await sharp(bytes).metadata().catch(() => null);
    const aspect = nearestAspectRatio(roomMeta?.width, roomMeta?.height);
    output = await redesignRoom(bytes, file.type, style.prompt, notes, aspect);
  } catch (e) {
    // Log the failed attempt so the user's history is honest.
    await supabase.from("projects").insert({
      user_id: user.id,
      style: style.id,
      input_path: inputPath,
      status: "failed",
    });
    console.error("redesign failed:", e);
    return NextResponse.json(
      {
        error:
          "Tasarım oluşturulamadı. Fotoğraf yeterince net olmayabilir; farklı bir fotoğrafla ya da biraz sonra tekrar dene.",
      },
      { status: 502 }
    );
  }

  // 5b) Normalize the "before" to the EXACT dimensions of the "after" so the
  // before/after slider stays perfectly aligned (no zoom/crop mismatch).
  try {
    const meta = await sharp(output.buffer).metadata();
    if (meta.width && meta.height) {
      const normalizedBefore = await sharp(bytes)
        .resize(meta.width, meta.height, { fit: "cover", position: "centre" })
        .jpeg({ quality: 88 })
        .toBuffer();
      await supabase.storage.from("rooms").upload(inputPath, normalizedBefore, {
        contentType: "image/jpeg",
        upsert: true,
      });
    }
  } catch (e) {
    console.error("before-normalize skipped:", e); // non-fatal, keep original
  }

  // 6) Store the result.
  const outputPath = `${user.id}/outputs/${crypto.randomUUID()}.png`;
  const up2 = await supabase.storage.from("rooms").upload(outputPath, output.buffer, {
    contentType: output.mimeType,
    upsert: false,
  });
  if (up2.error) {
    return NextResponse.json({ error: "Sonuç kaydedilemedi." }, { status: 500 });
  }

  // 7) Record the project (RLS stamps it to this user).
  const { data: project, error: insErr } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      style: style.id,
      prompt: notes || null,
      input_path: inputPath,
      output_path: outputPath,
      status: "done",
    })
    .select()
    .single();
  if (insErr) {
    return NextResponse.json({ error: "Kayıt oluşturulamadı." }, { status: 500 });
  }

  // 8) Return temporary signed URLs so the browser can show before/after.
  const [{ data: inUrl }, { data: outUrl }] = await Promise.all([
    supabase.storage.from("rooms").createSignedUrl(inputPath, 3600),
    supabase.storage.from("rooms").createSignedUrl(outputPath, 3600),
  ]);

  return NextResponse.json({
    id: project.id,
    style: style.id,
    beforeUrl: inUrl?.signedUrl ?? null,
    afterUrl: outUrl?.signedUrl ?? null,
  });
}
