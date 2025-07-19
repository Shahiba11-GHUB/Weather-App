class WeatherService {
  constructor() {
    this.apiKey = "2e8ad26a52e4b2c3e05c3f588ded40eb"; // ✅ Your actual OpenWeatherMap API key
    this.baseCurrentUrl = "https://api.openweathermap.org/data/2.5/weather";
    this.baseForecastUrl = "https://api.openweathermap.org/data/2.5/forecast";
  }

  // Utility to get selected unit (metric or imperial)
  getSelectedUnit() {
    const isFahrenheit = document.getElementById("unitToggle")?.checked;
    return isFahrenheit ? "imperial" : "metric";
  }

  async getWeatherByCity(city) {
    const unit = this.getSelectedUnit();
    const url = `${this.baseCurrentUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=${unit}`;
    return await this.fetchWeather(url);
  }

  async getWeatherByCoordinates(lat, lon) {
    const unit = this.getSelectedUnit();
    const url = `${this.baseCurrentUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=${unit}`;
    return await this.fetchWeather(url);
  }

  async get5DayForecastByCity(city) {
    const unit = this.getSelectedUnit();
    const url = `${this.baseForecastUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=${unit}`;
    return await this.fetchWeather(url);
  }

  async fetchWeather(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Weather data fetch failed");
    return await response.json();
  }
  // Add this method to your existing class
async getHourlyData(city) {
  const unit = this.getSelectedUnit();
  const url = `${this.baseForecastUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=${unit}`;
  const data = await this.fetchWeather(url);
  
  // Extract just the next 24 hours (8 periods of 3-hour data)
  return {
    ...data,
    list: data.list.slice(0, 8)
  };
}
}
