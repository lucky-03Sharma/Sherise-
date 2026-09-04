/**
 * AI Severity Detection Engine
 * Analyzes complaint type + description to auto-assign priority level.
 * Keywords are weighted; the highest-scoring category wins.
 */

const SEVERITY_KEYWORDS = {
  urgent: {
    weight: 4,
    terms: [
      "rape", "raped", "gang rape", "sexual assault", "molest", "molested",
      "kidnap", "kidnapped", "abduct", "abducted", "murder", "kill", "killing",
      "weapon", "knife", "gun", "acid", "acid attack", "bleeding", "blood",
      "life threat", "death threat", "suicide", "self harm", "emergency",
      "hostage", "trafficking", "child abuse", "minor", "unconscious",
      "critical", "dying", "forced", "drugged",
    ],
  },
  high: {
    weight: 3,
    terms: [
      "stalking", "stalker", "harassment", "abuse", "domestic violence",
      "beating", "beaten", "hit", "slap", "slapped", "punch", "punched",
      "choking", "choked", "threat", "threatening", "blackmail", "extortion",
      "dowry", "torture", "physical abuse", "sexual harassment", "groping",
      "touched inappropriately", "cyberstalking", "revenge porn", "sextortion",
      "forced marriage", "honor killing", "violence", "assault", "attacked",
      "injured", "bruise", "fracture", "broken bone",
    ],
  },
  medium: {
    weight: 2,
    terms: [
      "verbal abuse", "mental torture", "emotional abuse", "manipulation",
      "gaslighting", "intimidation", "bullying", "workplace harassment",
      "discrimination", "eve teasing", "catcalling", "obscene", "vulgar",
      "inappropriate", "unwanted", "uncomfortable", "scared", "afraid",
      "anxious", "depressed", "helpless", "isolation", "controlling",
      "possessive", "jealous", "restricting", "monitoring",
    ],
  },
  low: {
    weight: 1,
    terms: [
      "rude", "disrespect", "insult", "misbehave", "staring", "following",
      "prank call", "spam", "annoying", "uncomfortable situation",
      "general complaint", "feedback", "suggestion",
    ],
  },
};

const COMPLAINT_TYPE_BOOST = {
  "Rape": "urgent",
  "Sexual harassment": "high",
  "Domestic Violence": "high",
  "Threats": "high",
  "Mental Torture": "medium",
  "Other": null,
};

/**
 * Detect severity from complaint data.
 * @param {string} type - The complaint type category
 * @param {string} description - The complaint description text
 * @returns {{ priority: string, score: number, matchedTerms: string[] }}
 */
function detectSeverity(type, description) {
  const text = `${type || ""} ${description || ""}`.toLowerCase();
  const scores = { urgent: 0, high: 0, medium: 0, low: 0 };
  const matchedTerms = [];

  for (const [level, config] of Object.entries(SEVERITY_KEYWORDS)) {
    for (const term of config.terms) {
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
      const matches = text.match(regex);
      if (matches) {
        scores[level] += matches.length * config.weight;
        matchedTerms.push(`${term} (${level})`);
      }
    }
  }

  // Boost from complaint type
  const typeBoost = COMPLAINT_TYPE_BOOST[type];
  if (typeBoost) {
    scores[typeBoost] += SEVERITY_KEYWORDS[typeBoost].weight * 2;
  }

  // Find highest scoring level
  let maxScore = 0;
  let priority = "medium"; // default

  for (const [level, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      priority = level;
    }
  }

  // If urgent keywords found even once, escalate
  if (scores.urgent > 0 && priority !== "urgent") {
    priority = "urgent";
    maxScore = scores.urgent;
  }

  return {
    priority,
    score: maxScore,
    matchedTerms,
  };
}

module.exports = { detectSeverity };
