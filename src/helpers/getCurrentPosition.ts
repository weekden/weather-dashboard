export function getCurrentPosition(): Promise<GeolocationCoordinates> {
  return new Promise<GeolocationCoordinates>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        resolve(position.coords);
      },
      (error: GeolocationPositionError) => {
        reject(error);
      }
    );
  });
}
