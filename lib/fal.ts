import { fal } from "@fal-ai/client";

// Server-only. Image engine = Nano Banana (Gemini 2.5 Flash Image) via fal.ai.
fal.config({ credentials: process.env.FAL_KEY as string });

const EDIT_MODEL = "fal-ai/nano-banana/edit";

function detail(e: any): string {
  const parts: string[] = [];
  if (e?.status) parts.push("status=" + e.status);
  if (e?.message) parts.push(e.message);
  if (e?.body) {
    try {
      parts.push("body=" + JSON.stringify(e.body));
    } catch {
      /* ignore */
    }
  }
  return parts.join(" | ") || String(e);
}

// HERO differentiator: keep the room's real architecture, change only decor.
function buildStructureLockPrompt(stylePrompt: string, notes?: string): string {
  return [
    "Redesign the room in this photo.",
    "CRITICAL: Keep the room's ARCHITECTURAL structure EXACTLY the same —",
    "wall positions, windows, doors, ceiling, and room proportions must not change.",
    "Also do NOT add or remove any people; if a person is present keep them unchanged.",
    "Only change the furniture, decor, colors, textiles and overall atmosphere.",
    `Apply this style: ${stylePrompt}`,
    notes ? `Extra request from the user: ${notes}` : "",
    "Make it a photorealistic, high-quality interior photograph with realistic",
    "lighting and shadows consistent with the room's windows. Single coherent image.",
  ]
    .filter(Boolean)
    .join(" ");
}

export type RedesignResult = { buffer: Buffer; mimeType: string };

export async function redesignRoom(
  inputBuffer: Buffer,
  inputMime: string,
  stylePrompt: string,
  notes?: string
): Promise<RedesignResult> {
  if (!process.env.FAL_KEY) {
    throw new Error(
      "FAL_KEY okunamadı — .env.local'e eklendi mi ve sunucu (npm run dev) TAMAMEN yeniden başlatıldı mı?"
    );
  }

  // 1) Upload the input image to fal storage → get a URL for the model.
  let inputUrl: string;
  try {
    const blob = new Blob([new Uint8Array(inputBuffer)], { type: inputMime });
    inputUrl = await fal.storage.upload(blob as any);
  } catch (e) {
    throw new Error("fal-upload: " + detail(e));
  }

  // 2) Run the edit model.
  let result: any;
  try {
    result = await fal.subscribe(EDIT_MODEL, {
      input: {
        prompt: buildStructureLockPrompt(stylePrompt, notes),
        image_urls: [inputUrl],
      },
    });
  } catch (e) {
    throw new Error("fal-model: " + detail(e));
  }

  const outUrl: string | undefined = result?.data?.images?.[0]?.url;
  if (!outUrl) throw new Error("fal-model: görsel dönmedi (" + JSON.stringify(result?.data ?? result).slice(0, 300) + ")");

  const resp = await fetch(outUrl);
  if (!resp.ok) throw new Error("OUTPUT_FETCH_FAILED status=" + resp.status);
  const buffer = Buffer.from(await resp.arrayBuffer());
  const mimeType = resp.headers.get("content-type") ?? "image/png";
  return { buffer, mimeType };
}

export type ShoppingItem = {
  name: string;
  description: string;
  estimatedPriceTRY: string;
  whereToBuy: string;
};

// "Make this room real" — shopping/budget list, generated via fal (no Google).
export async function listItems(styleLabel: string, notes?: string): Promise<ShoppingItem[]> {
  const prompt =
    `A living room was just redesigned in the "${styleLabel}" interior style` +
    (notes ? ` with this extra request: "${notes}"` : "") +
    `. List the main furniture and decor items someone would buy to achieve this look. ` +
    `Return ONLY a JSON array, no markdown, no prose. Each element is an object with exactly ` +
    `these string fields: "name", "description" (one short line), "estimatedPriceTRY" ` +
    `(a price range in Turkish Lira, e.g. "3.000–5.000 TL"), "whereToBuy" (type of store). ` +
    `Return 5 to 8 items.`;

  let result: any;
  try {
    result = await fal.subscribe("fal-ai/any-llm", {
      input: {
        prompt,
        system_prompt:
          "You are an interior-design shopping assistant for the Turkish market. Output valid JSON only.",
      },
    });
  } catch (e) {
    throw new Error("fal-llm: " + detail(e));
  }

  const raw = String(result?.data?.output ?? "")
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ShoppingItem[]) : [];
  } catch {
    return [];
  }
}
