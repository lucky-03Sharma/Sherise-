import API from "./api";
import { getCurrentPosition, dialHelpline } from "./emergencyService";
import { startLiveLocationSharing } from "./liveLocationClient";

/**
 * Triggers One-Tap SOS emergency call to nearest responder (police, sherise member, or emergency support)
 * @param {string} preferredTarget - "support" | "police" | "sherise"
 */
export async function triggerOneTapSOS(preferredTarget = "support") {
  let coords = { latitude: 0, longitude: 0, accuracy: 0 };

  try {
    const position = await Promise.race([
      getCurrentPosition(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Location timeout")), 6000)
      ),
    ]);
    coords = position.coords;
  } catch (locErr) {
    console.warn("Could not retrieve precise location:", locErr.message);
  }

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
