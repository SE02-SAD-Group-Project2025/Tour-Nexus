import { attractionsMap } from "./attractionsMap.js";

export function normalizeStyles(styles) {
  if (!styles) return [];
  if (Array.isArray(styles)) return styles.map(s => String(s).toLowerCase().trim());
  return String(styles)
    .split(",")
    .map(s => s.toLowerCase().trim())
    .filter(Boolean);
}

export function getAllowedAttractionsByStyles(travelStyles = []) {
  const allowed = [];
  const seen = new Set();

  for (const style of travelStyles) {
    const list = attractionsMap[style];
    if (!list) continue;

    for (const item of list) {
      const key = `${item.name}__${item.city}`;
      if (seen.has(key)) continue;
      seen.add(key);
      allowed.push(item);
    }
  }

  return allowed;
}
