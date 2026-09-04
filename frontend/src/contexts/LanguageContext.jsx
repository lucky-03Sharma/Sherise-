import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  SUPPORTED_LANGUAGES,
  getCachedTranslation,
  translateBatch,
} from "../services/translateService";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("sherise_lang") || "en-IN";
  });
  const [translations, setTranslations] = useState({});
  const [isTranslating, setIsTranslating] = useState(false);

  const setLanguage = (newLang) => {
    setLanguageState(newLang);
    localStorage.setItem("sherise_lang", newLang);
  };

  // Helper function: synchronous translation if available, or returns text
  const t = useCallback(
    (text) => {
      if (!text || language === "en-IN") return text;
      // 1. Check in-memory state
      if (translations[text]) return translations[text];
      // 2. Check cached dictionary / localStorage
      const cached = getCachedTranslation(text, language);
      if (cached) return cached;
      return text;
    },
    [language, translations]
  );

  // Request dynamic translation for specific phrases or component texts
  const requestTranslations = useCallback(
    async (texts) => {
      if (!texts || texts.length === 0 || language === "en-IN") return;
      setIsTranslating(true);
      try {
        const translatedList = await translateBatch(texts, language);
        const map = {};
        texts.forEach((orig, idx) => {
          map[orig] = translatedList[idx] || orig;
        });
        setTranslations((prev) => ({ ...prev, ...map }));
      } finally {
        setIsTranslating(false);
      }
    },
    [language]
  );

  useEffect(() => {
    // When language changes, reset active in-memory cache and re-populate from persistent storage
    setTranslations({});
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        requestTranslations,
        isTranslating,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
