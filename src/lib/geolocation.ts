// Client-only. Wraps the browser Geolocation API in a promise and formats
// a plain Google Maps link from the coordinates — no geocoding API/key
// needed, the link itself drops a pin at the exact spot.

export type SharedLocation = {
  lat: number;
  lng: number;
  mapsLink: string;
};

export function mapsLinkFor(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export function getCurrentLocation(): Promise<SharedLocation> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Location isn't available on this device/browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        resolve({ lat, lng, mapsLink: mapsLinkFor(lat, lng) });
      },
      (err) => {
        const message =
          err.code === err.PERMISSION_DENIED
            ? "Location permission was denied."
            : "Couldn't get your location. Try typing your address instead.";
        reject(new Error(message));
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  });
}
