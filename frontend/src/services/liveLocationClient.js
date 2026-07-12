import API from "./api";

let activeClient = null;

class LiveLocationClient {
  constructor(alertId) {
    this.alertId = alertId;
    this.watchId = null;
    this.lastSentAt = 0;
    this.minIntervalMs = 5000;
  }

  start() {
    if (!navigator.geolocation) {
      console.warn("Geolocation unavailable — live updates disabled");
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => this.handlePosition(position),
      (error) => console.error("Live location error:", error),
      {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 20000,
      }
    );

    activeClient = this;
    sessionStorage.setItem("activeEmergencyAlertId", this.alertId);
  }

  async handlePosition(position) {
    const now = Date.now();
    if (now - this.lastSentAt < this.minIntervalMs) {
      return;
    }

    this.lastSentAt = now;

    try {
      await API.put(`/emergency/${this.alertId}/location`, {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
    } catch (error) {
      console.error("Failed to send live location update:", error);
    }
  }

  async stop() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    try {
      await API.put(`/emergency/${this.alertId}/end`);
    } catch (error) {
      console.error("Failed to end emergency session:", error);
    }

    if (activeClient === this) {
      activeClient = null;
    }

    sessionStorage.removeItem("activeEmergencyAlertId");
  }
}

export function startLiveLocationSharing(alertId) {
  if (activeClient) {
    activeClient.stop();
  }

  const client = new LiveLocationClient(alertId);
  client.start();
  return client;
}

export function getActiveLiveLocationClient() {
  return activeClient;
}

export async function stopLiveLocationSharing() {
  if (activeClient) {
    await activeClient.stop();
  }
}

export default LiveLocationClient;
