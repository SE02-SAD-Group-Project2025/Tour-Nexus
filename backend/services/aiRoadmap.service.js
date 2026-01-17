import openai from "../utils/openaiClient.js";

/**
 * Validate LLM roadmap output
 * - Must be JSON
 * - Must contain roadmap array length == duration
 * - Each attraction must exist in allowed list
 */
function validateRoadmapOutput(parsed, allowedSet, duration) {
  if (!parsed || typeof parsed !== "object") throw new Error("AI output is not an object");
  if (!Array.isArray(parsed.roadmap)) throw new Error("AI output missing roadmap[]");

  if (parsed.roadmap.length !== duration) {
    throw new Error(`Roadmap length must equal duration (${duration})`);
  }

  for (const dayItem of parsed.roadmap) {
    if (typeof dayItem?.day !== "number") throw new Error("Each roadmap item must have numeric day");
    if (typeof dayItem?.attraction !== "string") throw new Error("Each roadmap item must have attraction string");
    if (typeof dayItem?.city !== "string") throw new Error("Each roadmap item must have city string");

    const key = `${dayItem.attraction}__${dayItem.city}`;
    if (!allowedSet.has(key)) {
      throw new Error(`Attraction not allowed: ${dayItem.attraction} (${dayItem.city})`);
    }
  }

  return true;
}

function safeJsonParse(text) {
  // Handles cases where model returns ```json ... ```
  const cleaned = String(text)
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}

/**
 * Generate attraction-based roadmap for Sri Lanka.
 * @param {Object} params
 * @param {number} params.duration
 * @param {string[]} params.travelStyles  normalized style keys (adventure, cultural, etc.)
 * @param {string} params.groupType
 * @param {Array<{name:string, city:string}>} params.allowedAttractions
 */
export async function generateAttractionRoadmap({
  duration,
  travelStyles,
  groupType,
  allowedAttractions,
}) {
  if (!Number.isInteger(duration) || duration < 1 || duration > 21) {
    throw new Error("duration must be an integer between 1 and 21");
  }
  if (!Array.isArray(allowedAttractions) || allowedAttractions.length === 0) {
    throw new Error("No allowed attractions found for selected travel styles");
  }

  // Create an allowlist set for strict validation
  const allowedSet = new Set(allowedAttractions.map(a => `${a.name}__${a.city}`));

  // Keep prompt size reasonable
  const limitedAllowed = allowedAttractions.slice(0, 180); // adjust if needed

  const system = `
You are a Sri Lanka tourism roadmap planner.
You must choose attractions ONLY from the provided list.
Do not invent new attractions.
Return STRICT JSON only. No markdown. No extra text.
Make the sequence geographically reasonable (minimize backtracking).
Each day must include:
- day (1..N)
- attraction (string from list)
- city (string from list)
- short_reason (<= 16 words)
`.trim();

  const user = `
Tourist preferences:
- Duration: ${duration} days
- Travel styles: ${travelStyles.join(", ")}
- Group type: ${groupType}

Allowed attractions (choose ONLY from these exact pairs):
${limitedAllowed.map(a => `- ${a.name} (city: ${a.city})`).join("\n")}

Return JSON format:
{
  "roadmap": [
    { "day": 1, "attraction": "...", "city": "...", "short_reason": "..." }
  ]
}
`.trim();

  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  const content = resp.choices?.[0]?.message?.content ?? "";
  const parsed = safeJsonParse(content);

  // Validate strictly against allowed list + duration
  validateRoadmapOutput(parsed, allowedSet, duration);

  return parsed; // { roadmap: [...] }
}

/**
 * Fallback roadmap if AI fails (simple selection)
 * Picks first N attractions and assigns days.
 */
export function fallbackRoadmap(duration, allowedAttractions) {
  const chosen = allowedAttractions.slice(0, duration);
  return {
    roadmap: chosen.map((a, idx) => ({
      day: idx + 1,
      attraction: a.name,
      city: a.city,
      short_reason: "Fallback plan (AI unavailable).",
    })),
  };
}
