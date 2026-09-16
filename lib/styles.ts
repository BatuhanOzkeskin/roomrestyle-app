// Preset interior styles the user can pick with one tap.
// Keeping a curated set (not a free-for-all) is part of the "simple UX" promise
// and keeps AI output predictable.

export type StylePreset = {
  id: string;
  label: string;      // shown to the user
  labelTr: string;    // Turkish label
  prompt: string;     // appended to the structure-lock prompt
};

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: "scandinavian",
    label: "Scandinavian",
    labelTr: "İskandinav",
    prompt:
      "Scandinavian style: light wood tones, soft neutral palette, clean minimal furniture, plenty of natural light, a few green plants, cozy and airy.",
  },
  {
    id: "modern-minimalist",
    label: "Modern Minimalist",
    labelTr: "Modern Minimalist",
    prompt:
      "Modern minimalist style: neutral colors, sleek low-profile furniture, uncluttered surfaces, subtle textures, clean lines.",
  },
  {
    id: "industrial",
    label: "Industrial",
    labelTr: "Endüstriyel",
    prompt:
      "Industrial style: dark tones, exposed metal and brick accents, leather and wood, moody warm lighting.",
  },
  {
    id: "boho",
    label: "Bohemian",
    labelTr: "Bohem",
    prompt:
      "Bohemian (boho) style: warm earthy colors, layered textiles and rugs, rattan, macrame, lots of plants, eclectic cozy feel.",
  },
  {
    id: "japandi",
    label: "Japandi",
    labelTr: "Japandi",
    prompt:
      "Japandi style: a blend of Japanese and Scandinavian — natural materials, muted calm palette, low furniture, simple, serene, functional.",
  },
  {
    id: "coastal",
    label: "Coastal",
    labelTr: "Kıyı / Coastal",
    prompt:
      "Coastal style: light and breezy, whites and soft blues, natural linen and rattan, relaxed beach-house feel.",
  },
];

export function getStyle(id: string): StylePreset | undefined {
  return STYLE_PRESETS.find((s) => s.id === id);
}
