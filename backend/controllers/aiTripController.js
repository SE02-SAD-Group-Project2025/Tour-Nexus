import { normalizeStyles, getAllowedAttractionsByStyles } from "../utils/attractionsHelpers.js";
import { generateAttractionRoadmap, fallbackRoadmap } from "../services/aiRoadmap.service.js";

export const createRoadmap = async (req, res) => {
  try {
    const { duration, travel_style, group_type } = req.body;

    const styles = normalizeStyles(travel_style);
    const allowedAttractions = getAllowedAttractionsByStyles(styles);

    // Generate roadmap via LLM
    const roadmap = await generateAttractionRoadmap({
      duration: Number(duration),
      travelStyles: styles,
      groupType: group_type || "unknown",
      allowedAttractions,
    });

    res.json({ ok: true, ...roadmap, meta: { styles, duration: Number(duration) } });
  } catch (err) {
    // Optional fallback to keep UX smooth
    try {
      const { duration, travel_style } = req.body;
      const styles = normalizeStyles(travel_style);
      const allowedAttractions = getAllowedAttractionsByStyles(styles);
      const fb = fallbackRoadmap(Number(duration), allowedAttractions);
      return res.status(200).json({ ok: true, ...fb, meta: { fallback: true, error: err.message } });
    } catch (e2) {
      return res.status(400).json({ ok: false, error: err.message });
    }
  }
};
