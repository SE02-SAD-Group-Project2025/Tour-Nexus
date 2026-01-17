// services/aiRoadmap.service.js
import { geminiModel } from "../utils/geminiClient.js";

/**
 * Validate LLM roadmap output
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
  const cleaned = String(text)
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}

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
    throw new Error("No allowed attractions found");
  }

  const allowedSet = new Set(
    allowedAttractions.map(a => `${a.name}__${a.city}`)
  );

  const limitedAllowed = allowedAttractions.slice(0, 180);

  // 🔥 Gemini prompt (system + user combined)
  const prompt = `
You are a Sri Lanka tourism roadmap planner.

STRICT RULES:
- Use ONLY attractions from the provided list
- DO NOT invent new attractions
- Output MUST be valid JSON only
- No markdown
- No explanations
- No extra text

Each day must include:
- day (1..${duration})
- attraction
- city
- short_reason (max 16 words)

Tourist preferences:
- Duration: ${duration} days
- Travel styles: ${travelStyles.join(", ")}
- Group type: ${groupType}

Allowed attractions (exact pairs):
${limitedAllowed.map(a => `- ${a.name} (city: ${a.city})`).join("\n")}

Return format:
{
  "roadmap": [
    { "day": 1, "attraction": "...", "city": "...", "short_reason": "..." }
  ]
}
`;

  const result = await geminiModel.generateContent(prompt);
  const content = result.response.text();

  const parsed = safeJsonParse(content);
  validateRoadmapOutput(parsed, allowedSet, duration);

  return parsed;
}

/**
 * Fallback roadmap
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
