import API from "./api";

// Supported Indian languages via Sarvam AI
export const SUPPORTED_LANGUAGES = [
  { code: "en-IN", name: "English", nativeName: "English" },
  { code: "hi-IN", name: "Hindi", nativeName: "हिन्दी" },
  { code: "bn-IN", name: "Bengali", nativeName: "বাংলা" },
  { code: "ta-IN", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te-IN", name: "Telugu", nativeName: "తెలుగు" },
  { code: "mr-IN", name: "Marathi", nativeName: "मराठी" },
  { code: "gu-IN", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "kn-IN", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml-IN", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "pa-IN", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "od-IN", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
  { code: "ur-IN", name: "Urdu", nativeName: "اردو" },
];

// Offline instant translation dictionary for common critical UI strings
export const CORE_DICTIONARY = {
  "hi-IN": {
    "Home": "होम",
    "Login": "लॉग इन",
    "Register": "पंजीकरण करें",
    "Dashboard": "डैशबोर्ड",
    "Complaints": "शिकायतें",
    "Therapy": "थेरेपी",
    "Consultation": "परामर्श",
    "Helplines": "हेल्पलाइन",
    "Logout": "लॉग आउट",
    "Register a Complaint": "शिकायत दर्ज करें",
    "File Complaint": "शिकायत दर्ज करें",
    "Book Therapy": "थेरेपी बुक करें",
    "Consult Expert": "विशेषज्ञ परामर्श लें",
    "Emergency Helplines": "आपातकालीन हेल्पलाइन",
    "Call Now": "अभी कॉल करें",
    "Voice SOS": "वॉइस एसओएस",
    "Urgent": "अति आवश्यक",
    "High": "उच्च",
    "Medium": "मध्यम",
    "Low": "सामान्य",
    "Severity": "गंभीरता",
    "Submit Complaint": "शिकायत भेजें",
    "Your safety matters": "आपकी सुरक्षा हमारी प्राथमिकता है",
    "SOS Emergency": "एसओएस आपातकाल",
    "Quick Actions": "त्वरित क्रियाएं",
    "My Complaints": "मेरी शिकायतें",
    "Total Reports": "कुल रिपोर्ट",
    "Therapy Sessions": "थेरेपी सत्र",
    "Consultations": "परामर्श",
  },
  "bn-IN": {
    "Home": "হোম",
    "Login": "লগইন",
    "Register": "নিবন্ধন করুন",
    "Dashboard": "ড্যাশবোর্ড",
    "Complaints": "অভিযোগ",
    "Therapy": "থেরাপি",
    "Consultation": "পরামর্শ",
    "Helplines": "হেল্পলাইন",
    "Logout": "লগআউট",
    "Register a Complaint": "অভিযোগ দায়ের করুন",
    "Call Now": "এখনই কল করুন",
    "Urgent": "জরুরী",
    "High": "উচ্চ",
    "SOS Emergency": "এসওএস জরুরি অবস্থা",
  },
  "te-IN": {
    "Home": "హోమ్",
    "Login": "లాగిన్",
    "Register": "నమోదు చేసుకోండి",
    "Dashboard": "డ్యాష్‌బోర్డ్",
    "Complaints": "ఫిర్యాదులు",
    "Therapy": "థెరపీ",
    "Consultation": "సంప్రదింపులు",
    "Helplines": "హెల్ప్‌లైన్లు",
    "Logout": "లాగ్ అవుట్",
    "Call Now": "ఇప్పుడే కాల్ చేయండి",
    "Urgent": "అత్యవసరం",
    "SOS Emergency": "ఎస్ఓఎస్ అత్యవసర",
  },
  "ta-IN": {
    "Home": "முகப்பு",
    "Login": "உள்நுழைக",
    "Register": "பதிவு செய்க",
    "Dashboard": "டாஷ்போர்டு",
    "Complaints": "புகார்கள்",
    "Therapy": "சிகிச்சை",
    "Consultation": "ஆலோசனை",
    "Helplines": "உதவி எண்கள்",
    "Logout": "வெளியேறு",
    "Call Now": "இப்போது அழைக்கவும்",
    "Urgent": "அவசரம்",
    "SOS Emergency": "எஸ்.ஓ.எஸ் அவசர உதவி",
  },
  "mr-IN": {
    "Home": "मुख्यपृष्ठ",
    "Login": "लॉगिन",
    "Register": "नोंदणी करा",
    "Dashboard": "डॅशबोर्ड",
    "Complaints": "तक्रारी",
    "Therapy": "थेरपी",
    "Consultation": "सल्लामसलत",
    "Helplines": "हेल्पलाइन",
    "Logout": "बाहेर पडा",
    "Call Now": "आता कॉल करा",
    "Urgent": "तातडीचे",
    "SOS Emergency": "एसओएस आणीबाणी",
  },
  "gu-IN": {
    "Home": "હોમ",
    "Login": "લૉગિન",
    "Register": "નોંધણી કરો",
    "Dashboard": "ડેશબોર્ડ",
    "Complaints": "ફરિયાદો",
    "Therapy": "થેરપી",
    "Consultation": "પરામર્શ",
    "Helplines": "હેલ્પલાઇન",
    "Logout": "લૉગ આઉટ",
    "Call Now": "હમણાં કૉલ કરો",
    "Urgent": "તાત્કાલિક",
    "SOS Emergency": "એસઓએસ કટોકટી",
  }
};

const CACHE_KEY_PREFIX = "sherise_tr_";

export function getCachedTranslation(text, lang) {
  if (lang === "en-IN") return text;
  // Check fast dictionary first
  if (CORE_DICTIONARY[lang] && CORE_DICTIONARY[lang][text]) {
    return CORE_DICTIONARY[lang][text];
  }
  // Check localStorage cache
  try {
    const cached = localStorage.getItem(`${CACHE_KEY_PREFIX}${lang}_${text}`);
    if (cached) return cached;
  } catch (e) {
    // Ignore storage errors
  }
  return null;
}

export function setCachedTranslation(text, lang, translated) {
  try {
    localStorage.setItem(`${CACHE_KEY_PREFIX}${lang}_${text}`, translated);
  } catch (e) {
    // Ignore storage quotas
  }
}

/**
 * Translate a batch of texts using Sarvam API (via backend proxy)
 */
export async function translateBatch(texts, targetLang) {
  if (!texts || texts.length === 0 || targetLang === "en-IN") {
    return texts;
  }

  const results = [...texts];
  const uncachedIndices = [];
  const uncachedTexts = [];

  texts.forEach((text, i) => {
    const cached = getCachedTranslation(text, targetLang);
    if (cached) {
      results[i] = cached;
    } else {
      uncachedIndices.push(i);
      uncachedTexts.push(text);
    }
  });

  if (uncachedTexts.length === 0) {
    return results;
  }

  try {
    const res = await API.post("/translate", {
      texts: uncachedTexts,
      targetLang,
    });

    const translations = res.data?.translations || [];
    translations.forEach((tr, idx) => {
      const originalIndex = uncachedIndices[idx];
      const originalText = uncachedTexts[idx];
      results[originalIndex] = tr;
      setCachedTranslation(originalText, targetLang, tr);
    });
  } catch (err) {
    console.warn("Sarvam translation failed or offline:", err.message);
    // Keep original texts if API unavailable
  }

  return results;
}
