import { GoogleGenAI } from "@google/genai";

// Server-only module. The API key never reaches the browser.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

const IMAGE_MODEL = "gemini-2.5-flash-image"; // "Nano Banana"
const TEXT_MODEL = "gemini-2.5-flash";

/**
 * Our HERO differentiator, encoded as a prompt:
 * keep the room's real architecture, change only the decor/style.
 */
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

export type RedesignResult = { data: string; mimeType: string };

/** Sends the room photo + style to Gemini and returns the redesigned image (base64). */
export async function redesignRoom(
  base64: string,
  mimeType: string,
  stylePrompt: string,
  notes?: string
): Promise<RedesignResult> {
  const res = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { text: buildStructureLockPrompt(stylePrompt, notes) },
          { inlineData: { mimeType, data: base64 } },
        ],
      },
    ],
  });

  const parts = res.candidates?.[0]?.content?.parts ?? [];
  for (const p of parts) {
    if (p.inlineData?.data) {
      return { data: p.inlineData.data, mimeType: p.inlineData.mimeType ?? "image/png" };
    }
  }
  throw new Error("MODEL_NO_IMAGE");
}

export type ShoppingItem = {
  name: string;
  description: string;
  estimatedPriceTRY: string;
  whereToBuy: string;
};

/**
 * Our WOW differentiator: turn the generated design into an actionable
 * shopping/budget list (Turkish Lira).
 */
export async function listItems(base64: string, mimeType: string): Promise<ShoppingItem[]> {
  const res = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          {
            text:
              "Look at this interior design image. List the main furniture and decor items. " +
              "Return ONLY a JSON array (no markdown, no prose). Each element must be an object " +
              'with exactly these string fields: "name" (short name), "description" (one line), ' +
              '"estimatedPriceTRY" (price range in Turkish Lira, e.g. "3.000–5.000 TL"), ' +
              '"whereToBuy" (type of store). Return 4 to 8 items.',
          },
          { inlineData: { mimeType, data: base64 } },
        ],
      },
    ],
    config: { responseMimeType: "application/json" },
  });

  try {
    const raw = (res.text ?? "[]").trim().replace(/^```json\s*|\s*```$/g, "");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ShoppingItem[]) : [];
  } catch {
    return [];
  }
}
