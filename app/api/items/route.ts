import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { listItems } from "@/lib/fal";
import { getStyle } from "@/lib/styles";

export const runtime = "nodejs";
export const maxDuration = 60;

// "Make this room real" — turn a design into a shopping/budget list (via fal).
export async function POST(req: NextRequest) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Giriş yapmalısın." }, { status: 401 });
  }

  let body: { id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }
  if (!body.id) {
    return NextResponse.json({ error: "Proje bulunamadı." }, { status: 400 });
  }

  // RLS guarantees the user can only read their own project.
  const { data: project, error } = await supabase
    .from("projects")
    .select("id, style, prompt, items")
    .eq("id", body.id)
    .single();
  if (error || !project) {
    return NextResponse.json({ error: "Proje bulunamadı." }, { status: 404 });
  }

  // Cached — don't call the model twice.
  if (project.items) {
    return NextResponse.json({ items: project.items });
  }

  const style = getStyle(project.style ?? "");
  const styleLabel = style?.label ?? project.style ?? "modern";

  let items;
  try {
    items = await listItems(styleLabel, project.prompt ?? undefined);
  } catch (e) {
    return NextResponse.json(
      { error: "HATA: " + String((e as any)?.message ?? e) },
      { status: 502 }
    );
  }

  await supabase.from("projects").update({ items }).eq("id", project.id);
  return NextResponse.json({ items });
}
