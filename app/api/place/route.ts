import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";
import { placeFurniture, nearestAspectRatio } from "@/lib/fal";

export const runtime = "nodejs";
export const maxDuration = 60; // image generation can take a while

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB per image
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const RATE_PER_MINUTE = 8; // per-user throttle

const PLACEMENTS: Record<string, string> = {
  left: "on the left side of the room",
  center: "in the center of the room",
  right: "on the right side of the room",
};

function ext(mime: string) {
  return mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
}

export async function POST(req: NextRequest) {
  const supabase = createClient();

  // 1) Auth guard.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Giriş yapmalısın." }, { status: 401 });
  }

  // 2) Per-user rate limit.
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

  const roomFile = form.get("photo");
  const itemFile = form.get("item");
  const placementId = String(form.get("placement") ?? "center");
  const notes = String(form.get("notes") ?? "").slice(0, 300);
  const buyUrlRaw = String(form.get("buyUrl") ?? "").trim().slice(0, 500);

  for (const [f, label] of [
    [roomFile, "oda fotoğrafı"],
    [itemFile, "mobilya fotoğrafı"],
  ] as const) {
    if (!(f instanceof File)) {
      return NextResponse.json({ error: `Bir ${label} yükle.` }, { status: 400 });
    }
    if (!ALLOWED.includes(f.type)) {
      return NextResponse.json(
        { error: "Sadece JPG, PNG veya WEBP yükleyebilirsin." },
        { status: 400 }
      );
    }
    if (f.size > MAX_BYTES) {
      return NextResponse.json({ error: "Her dosya en fazla 10MB olabilir." }, { status: 400 });
    }
  }
  const room = roomFile as File;
  const item = itemFile as File;

  const placement = PLACEMENTS[placementId] ?? PLACEMENTS.center;

  // Only keep a syntactically valid http(s) link (stored for a "Satın Al" button).
  let buyUrl: string | null = null;
  if (buyUrlRaw) {
    try {
      const u = new URL(buyUrlRaw);
      if (u.protocol === "http:" || u.protocol === "https:") buyUrl = u.toString();
    } catch {
      /* ignore invalid link */
    }
  }

  const roomBytes = Buffer.from(await room.arrayBuffer());
  const itemBytes = Buffer.from(await item.arrayBuffer());
  const roomPath = `${user.id}/inputs/${crypto.randomUUID()}.${ext(room.type)}`;
  const itemPath = `${user.id}/refs/${crypto.randomUUID()}.${ext(item.type)}`;

  // 4) Store both inputs (RLS keeps this folder private to the user).
  const [up1, up2] = await Promise.all([
    supabase.storage.from("rooms").upload(roomPath, roomBytes, {
      contentType: room.type,
      upsert: false,
    }),
    supabase.storage.from("rooms").upload(itemPath, itemBytes, {
      contentType: item.type,
      upsert: false,
    }),
  ]);
  if (up1.error || up2.error) {
    return NextResponse.json({ error: "Fotoğraflar yüklenemedi." }, { status: 500 });
  }

  // 5) Composite via Nano Banana (multi-image). Handle failure gracefully.
  let output;
  try {
    // Keep the output framed like the user's room (avoids before/after drift).
    const roomMeta = await sharp(roomBytes).metadata().catch(() => null);
    const aspect = nearestAspectRatio(roomMeta?.width, roomMeta?.height);
    output = await placeFurniture(roomBytes, room.type, itemBytes, item.type, placement, notes, aspect);
  } catch (e) {
    console.error("place failed:", e);
    await supabase.from("projects").insert({
      user_id: user.id,
      mode: "place",
      input_path: roomPath,
      ref_path: itemPath,
      buy_url: buyUrl,
      status: "failed",
    });
    return NextResponse.json(
      {
        error:
          "Yerleştirme oluşturulamadı. Daha net bir oda ya da mobilya fotoğrafıyla, ya da biraz sonra tekrar dene.",
      },
      { status: 502 }
    );
  }

  // 5b) Normalize the "before" to the EXACT dimensions of the "after" so the
  // before/after slider stays perfectly aligned (no zoom/crop mismatch).
  try {
    const meta = await sharp(output.buffer).metadata();
    if (meta.width && meta.height) {
      const normalizedBefore = await sharp(roomBytes)
        .resize(meta.width, meta.height, { fit: "cover", position: "centre" })
        .jpeg({ quality: 88 })
        .toBuffer();
      await supabase.storage.from("rooms").upload(roomPath, normalizedBefore, {
        contentType: "image/jpeg",
        upsert: true,
      });
    }
  } catch (e) {
    console.error("before-normalize skipped:", e); // non-fatal, keep original
  }

  // 6) Store the result.
  const outputPath = `${user.id}/outputs/${crypto.randomUUID()}.png`;
  const up3 = await supabase.storage.from("rooms").upload(outputPath, output.buffer, {
    contentType: output.mimeType,
    upsert: false,
  });
  if (up3.error) {
    return NextResponse.json({ error: "Sonuç kaydedilemedi." }, { status: 500 });
  }

  // 7) Record the project.
  const { data: project, error: insErr } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      mode: "place",
      prompt: notes || null,
      input_path: roomPath,
      ref_path: itemPath,
      output_path: outputPath,
      buy_url: buyUrl,
      status: "done",
    })
    .select()
    .single();
  if (insErr) {
    return NextResponse.json({ error: "Kayıt oluşturulamadı." }, { status: 500 });
  }

  // 8) Signed URLs for before/after.
  const [{ data: inUrl }, { data: outUrl }] = await Promise.all([
    supabase.storage.from("rooms").createSignedUrl(roomPath, 3600),
    supabase.storage.from("rooms").createSignedUrl(outputPath, 3600),
  ]);

  return NextResponse.json({
    id: project.id,
    beforeUrl: inUrl?.signedUrl ?? null,
    afterUrl: outUrl?.signedUrl ?? null,
    buyUrl,
  });
}
