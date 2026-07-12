import API from "./api";

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported on this device"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    });
  });
}

export async function startEmergencyCall(helpline, triggerType = "manual_call") {
  const position = await getCurrentPosition();

  const res = await API.post("/emergency/call", {
    helplineId: helpline._id,
    helplineName: helpline.name,
    helplinePhone: helpline.phone,
    category: helpline.category,
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    triggerType,
  });

  return {
    ...res.data,
    coords: position.coords,
  };
}

export async function triggerVoiceHelpEmergency() {
  const position = await getCurrentPosition();
  const res = await API.post("/emergency/voice-help", {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
  });

  return {
    ...res.data,
    coords: position.coords,
  };
}

export function dialHelpline(phone) {
  const number = String(phone).replace(/[^\d+]/g, "");
  window.location.href = `tel:${number}`;
}

export async function getActiveEmergencyAlerts() {
  const res = await API.get("/emergency/active");
  return res.data.alerts || [];
}

export async function getMyEmergencyAlerts() {
  const res = await API.get("/emergency/my");
  return res.data.alerts || [];
}

export async function endEmergencyCall(alertId) {
  const res = await API.put(`/emergency/${alertId}/end`);
  return res.data;
}
