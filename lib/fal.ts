import { fal } from "@fal-ai/client";

// Server-only. Image engine = Nano Banana (Gemini 2.5 Flash Image) via fal.ai.
fal.config({ credentials: process.env.FAL_KEY as string });

const EDIT_MODEL = "fal-ai/nano-banana/edit";

// fal nano-banana supports a fixed set of output aspect ratios. Default "auto"
// lets the model reframe the room (breaks before/after alignment). We instead
// pick the ratio closest to the user's input so the output keeps the framing.
const ASPECTS: { id: string; r: number }[] = [
  { id: "21:9", r: 21 / 9 },
  { id: "16:9", r: 16 / 9 },
  { id: "3:2", r: 3 / 2 },
  { id: "4:3", r: 4 / 3 },
  { id: "5:4", r: 5 / 4 },
  { id: "1:1", r: 1 },
  { id: "4:5", r: 4 / 5 },
  { id: "3:4", r: 3 / 4 },
  { id: "2:3", r: 2 / 3 },
  { id: "9:16", r: 9 / 16 },
];

export function nearestAspectRatio(width?: number, height?: number): string | undefined {
  if (!width || !height) return undefined;
  const target = width / height;
  let best = ASPECTS[0];
  for (const a of ASPECTS) {
    if (Math.abs(a.r - target) < Math.abs(best.r - target)) best = a;
  }
  return best.id;
}

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
  notes?: string,
  aspectRatio?: string
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
        ...(aspectRatio ? { aspect_ratio: aspectRatio } : {}),
      } as any,
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

// FLAGSHIP (Mod B): place the user's OWN chosen product into their room.
// Two input images → one composited, architecture-preserving result.
function buildPlacementPrompt(placement: string, notes?: string): string {
  return [
    "You are given two images.",
    "IMAGE 1 is a photo of a room. IMAGE 2 is a single piece of furniture or product.",
    "Task: place the EXACT product shown in IMAGE 2 into the room from IMAGE 1.",
    `Where to place it: ${placement}.`,
    "CRITICAL: Keep the room's ARCHITECTURE exactly the same —",
    "wall positions, windows, doors, floor, ceiling and room proportions must not change.",
    "Do NOT restyle or replace the room's existing furniture and decor; only ADD this one product.",
    "Preserve the product's real appearance from IMAGE 2 — its shape, color, material and design.",
    "Match perspective, scale and lighting realistically so the product truly belongs in the room,",
    "casting shadows consistent with the room's light sources.",
    "Do NOT add or remove any people.",
    notes ? `Extra request from the user: ${notes}` : "",
    "Output a single, photorealistic, coherent interior photograph.",
  ]
    .filter(Boolean)
    .join(" ");
}

export async function placeFurniture(
  roomBuffer: Buffer,
  roomMime: string,
  itemBuffer: Buffer,
  itemMime: string,
  placement: string,
  notes?: string,
  aspectRatio?: string
): Promise<RedesignResult> {
  if (!process.env.FAL_KEY) {
    throw new Error(
      "FAL_KEY okunamadı — .env.local'e eklendi mi ve sunucu (npm run dev) TAMAMEN yeniden başlatıldı mı?"
    );
  }

  // 1) Upload BOTH images to fal storage.
  let roomUrl: string;
  let itemUrl: string;
  try {
    const roomBlob = new Blob([new Uint8Array(roomBuffer)], { type: roomMime });
    const itemBlob = new Blob([new Uint8Array(itemBuffer)], { type: itemMime });
    [roomUrl, itemUrl] = await Promise.all([
      fal.storage.upload(roomBlob as any),
      fal.storage.upload(itemBlob as any),
    ]);
  } catch (e) {
    throw new Error("fal-upload: " + detail(e));
  }

  // 2) Multi-image edit: order matters (room first, product second).
  let result: any;
  try {
    result = await fal.subscribe(EDIT_MODEL, {
      input: {
        prompt: buildPlacementPrompt(placement, notes),
        image_urls: [roomUrl, itemUrl],
        ...(aspectRatio ? { aspect_ratio: aspectRatio } : {}),
      } as any,
    });
  } catch (e) {
    throw new Error("fal-model: " + detail(e));
  }

  const outUrl: string | undefined = result?.data?.images?.[0]?.url;
  if (!outUrl)
    throw new Error(
      "fal-model: görsel dönmedi (" + JSON.stringify(result?.data ?? result).slice(0, 300) + ")"
    );

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
