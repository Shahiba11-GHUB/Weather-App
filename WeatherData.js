class WeatherData {
  constructor(data, isFahrenheit = false) {
    this.data = data;
    this.isFahrenheit = isFahrenheit;
  }

  // Current weather methods
  get city() {
    return this.data.name || '';
  }

  get country() {
    return this.data.sys?.country || '';
  }

  get temperature() {
    return this.isFahrenheit ? 
      this.kelvinToFahrenheit(this.data.main?.temp) :
      this.kelvinToCelsius(this.data.main?.temp);
  }

  get feelsLike() {
    return this.isFahrenheit ?
      this.kelvinToFahrenheit(this.data.main?.feels_like) :
      this.kelvinToCelsius(this.data.main?.feels_like);
  }

  get humidity() {
    return this.data.main?.humidity || 0;
  }

  get description() {
    return this.data.weather?.[0]?.description || '';
  }

  get icon() {
    return this.data.weather?.[0]?.icon || '';
  }

  get windSpeed() {
    return this.isFahrenheit ?
      (this.data.wind?.speed * 2.237).toFixed(1) : // m/s to mph
      (this.data.wind?.speed * 3.6).toFixed(1);   // m/s to km/h
  }

  get pressure() {
    return this.data.main?.pressure || 0;
  }

  get visibility() {
    return this.data.visibility ? (this.data.visibility / 1000).toFixed(1) : 0;
  }

  get sunrise() {
    return this.data.sys?.sunrise ? new Date(this.data.sys.sunrise * 1000) : null;
  }

  get sunset() {
    return this.data.sys?.sunset ? new Date(this.data.sys.sunset * 1000) : null;
  }

  get condition() {
    return this.data.weather?.[0]?.main?.toLowerCase() || '';
  }

  // Forecast methods
  getHourlyForecast() {
    return this.data.hourly?.map(item => ({
      time: new Date(item.dt * 1000),
      temp: this.isFahrenheit ? 
        this.kelvinToFahrenheit(item.temp) : 
        this.kelvinToCelsius(item.temp),
      condition: item.weather?.[0]?.main?.toLowerCase() || '',
      icon: item.weather?.[0]?.icon || '',
      pop: item.pop * 100 // Probability of precipitation (0-100)
    })) || [];
  }

  getDailyForecast() {
    return this.data.daily?.map(item => ({
      date: new Date(item.dt * 1000),
      temp_max: this.isFahrenheit ?
        this.kelvinToFahrenheit(item.temp.max) :
        this.kelvinToCelsius(item.temp.max),
      temp_min: this.isFahrenheit ?
        this.kelvinToFahrenheit(item.temp.min) :
        this.kelvinToCelsius(item.temp.min),
      condition: item.weather?.[0]?.main?.toLowerCase() || '',
      icon: item.weather?.[0]?.icon || '',
      pop: item.pop * 100 // Probability of precipitation (0-100)
    })) || [];
  }

  // Conversion utilities
  kelvinToCelsius(kelvin) {
    return kelvin ? Math.round(kelvin - 273.15) : 0;
  }

  kelvinToFahrenheit(kelvin) {
    return kelvin ? Math.round((kelvin - 273.15) * 9/5 + 32) : 0;
  }

  // Location
  getFullLocation() {
    return `${this.city}${this.country ? ', ' + this.country : ''}`;
  }
}