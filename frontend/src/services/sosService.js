import API from "./api";
import { getCurrentPosition, dialHelpline } from "./emergencyService";
import { startLiveLocationSharing } from "./liveLocationClient";

// Audio Context for Web Audio Deterrent Siren
let sirenContext = null;
let sirenOscillator = null;
let sirenGain = null;
let sirenInterval = null;

/**
 * High-accuracy GPS position with strict timeout fallback
 */
export async function getLiveCoordinates(timeoutMs = 3500) {
  try {
    const position = await Promise.race([
      getCurrentPosition(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("GPS Acquisition Timeout")), timeoutMs)
      ),
    ]);
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: Math.round(position.coords.accuracy || 0),
      isLive: true,
    };
  } catch (err) {
    console.warn("Fast GPS acquisition fallback:", err.message);
    return {
      latitude: null,
      longitude: null,
      accuracy: null,
      isLive: false,
    };
  }
}

/**
 * Triggers One-Tap SOS emergency call to nearest responder (police, sherise member, or emergency support)
 * @param {string} preferredTarget - "support" | "police" | "sherise"
 */
export async function triggerOneTapSOS(preferredTarget = "support") {
  const coords = await getLiveCoordinates(3500);

  const res = await API.post("/emergency/sos", {
    latitude: coords.latitude || undefined,
    longitude: coords.longitude || undefined,
    accuracy: coords.accuracy || undefined,
    preferredTarget,
  });

  const data = res.data;

  // Start continuous live tracking if alert was created
  if (data.alert?._id) {
    startLiveLocationSharing(data.alert._id);
  }

  // Dial responder number
  if (data.dialNumber || data.responder?.phone) {
    dialHelpline(data.dialNumber || data.responder.phone);
  }

  return {
    ...data,
    coords,
  };
}

/**
 * Web Audio Police / Deterrence Siren Generator
 */
export function startEmergencySiren() {
  if (sirenContext && sirenContext.state !== "closed") {
    return; // Already playing
  }

  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    sirenContext = new AudioCtx();
    sirenOscillator = sirenContext.createOscillator();
    sirenGain = sirenContext.createGain();

    sirenOscillator.type = "sawtooth";
    sirenGain.gain.setValueAtTime(0.35, sirenContext.currentTime);

    sirenOscillator.connect(sirenGain);
    sirenGain.connect(sirenContext.destination);

    let highPitch = true;
    sirenOscillator.frequency.setValueAtTime(700, sirenContext.currentTime);
    sirenOscillator.start();

    sirenInterval = setInterval(() => {
      if (!sirenContext || sirenContext.state === "closed") return;
      const targetFreq = highPitch ? 1150 : 650;
      sirenOscillator.frequency.exponentialRampToValueAtTime(
        targetFreq,
        sirenContext.currentTime + 0.35
      );
      highPitch = !highPitch;
    }, 400);
  } catch (err) {
    console.error("Could not start siren audio:", err);
  }
}

export function stopEmergencySiren() {
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
  if (sirenOscillator) {
    try {
      sirenOscillator.stop();
      sirenOscillator.disconnect();
    } catch (_) {}
    sirenOscillator = null;
  }
  if (sirenContext) {
    try {
      sirenContext.close();
    } catch (_) {}
    sirenContext = null;
  }
}

/**
 * Personal Emergency Contacts helpers
 */
const CONTACTS_KEY = "sherise_emergency_contacts_v1";

export function getStoredEmergencyContacts() {
  try {
    const data = localStorage.getItem(CONTACTS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (_) {}

  return [
    { id: "1", name: "Family / Guardian", phone: "" },
    { id: "2", name: "Trusted Friend", phone: "" },
  ];
}

export function saveStoredEmergencyContacts(contacts) {
  try {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  } catch (_) {}
}

/**
 * Builds direct WhatsApp & SMS URLs with live GPS
 */
export function buildEmergencyMessage(coords) {
  const locationText =
    coords?.latitude && coords?.longitude
      ? `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`
      : "Location access pending";

  return `🚨 EMERGENCY SOS ALERT from SheRise! 🚨\nI need immediate help! My live location is:\n${locationText}\nPlease contact emergency responders or call 112.`;
}

export function getWhatsAppEmergencyUrl(phone, coords) {
  const cleanPhone = phone ? phone.replace(/[^\d+]/g, "").replace(/^\+/, "") : "";
  const text = encodeURIComponent(buildEmergencyMessage(coords));
  return cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${text}`
    : `https://wa.me/?text=${text}`;
}

export function getSmsEmergencyUrl(phone, coords) {
  const cleanPhone = phone ? phone.replace(/[^\d+]/g, "") : "";
  const text = encodeURIComponent(buildEmergencyMessage(coords));
  return cleanPhone ? `sms:${cleanPhone}?body=${text}` : `sms:?body=${text}`;
}
