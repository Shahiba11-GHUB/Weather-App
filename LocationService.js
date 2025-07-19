
class LocationService {
  static getCurrentLocation() {
    console.log("LocationService.getCurrentLocation() called");
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        console.error("Geolocation not supported.");
        reject("Geolocation is not supported by your browser.");
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("Position acquired:", position.coords);
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Geolocation error:", error.message);
            reject("Unable to retrieve your location.");
          }
        );
      }
    });
  }
}
