/**
 * Translation Controller
 * Proxies translation requests to the Sarvam AI Translate API.
 */

const SARVAM_API_URL = "https://api.sarvam.ai/translate";

exports.translateTexts = async (req, res) => {
  try {
    const { texts, targetLang } = req.body;

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({ message: "texts array is required" });
    }

    if (!targetLang) {
      return res.status(400).json({ message: "targetLang is required" });
    }

    // If target is English, return texts as-is
    if (targetLang === "en-IN") {
      return res.json({ translations: texts });
    }

    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        message: "Translation service not configured. SARVAM_API_KEY is missing.",
      });
    }

    // Translate each text (batch — Sarvam API handles one text at a time)
    const translations = [];

    for (const text of texts) {
      if (!text || text.trim().length === 0) {
        translations.push(text);
        continue;
      }

      // Sarvam has a 2000 char limit per request
      const truncatedText = text.substring(0, 1900);

      try {
        const response = await fetch(SARVAM_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-subscription-key": apiKey,
          },
          body: JSON.stringify({
            input: truncatedText,
            source_language_code: "en-IN",
            target_language_code: targetLang,
            model: "mayura:v1",
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Sarvam API error:", response.status, errorText);
          translations.push(text); // Fallback to original
          continue;
        }

        const data = await response.json();
        translations.push(data.translated_text || text);
      } catch (fetchErr) {
        console.error("Sarvam fetch error:", fetchErr.message);
        translations.push(text); // Fallback to original
      }
    }

    res.json({ translations });
  } catch (err) {
    console.error("Translation controller error:", err);
    res.status(500).json({ message: err.message || "Translation failed" });
  }
};
