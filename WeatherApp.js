class WeatherApp {
  constructor() {
    this.weatherService = new WeatherService();
    this.unit = "C";
  }

  async getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    if (!city) {
      alert("Please enter a city name.");
      return;
    }

    this.showLoading(true);
    try {
      const currentData = await this.weatherService.getWeatherByCity(city);
      this.displayWeather(currentData);
      
      const forecastData = await this.weatherService.get5DayForecastByCity(city);
      await this.displayForecast(city);
      this.displayHourlyForecast(forecastData);
    } catch (error) {
      this.showError("Failed to fetch weather data.");
    }
    this.showLoading(false);
  }

  async getCurrentLocationWeather() {
    this.showLoading(true);
    try {
      const coords = await LocationService.getCurrentLocation();
      showMap(coords.latitude, coords.longitude);
      const currentData = await this.weatherService.getWeatherByCoordinates(coords.latitude, coords.longitude);
      this.displayWeather(currentData);
      const forecastData = await this.weatherService.get5DayForecastByCity(currentData.name);
      await this.displayForecast(currentData.name);
      this.displayHourlyForecast(forecastData);
    } catch (error) {
      this.showError("Failed to fetch weather using current location.");
    }
    this.showLoading(false);
  }

  toggleUnit() {
    this.unit = this.unit === "C" ? "F" : "C";
    this.getWeather();
  }

  showLoading(isLoading) {
    document.getElementById("loadingSpinner").classList.toggle("d-none", !isLoading);
  }

  showError(message) {
    const box = document.getElementById("weatherResult");
    box.classList.remove("d-none");
    box.classList.add("fade-in");
    box.innerHTML = `<p style="color: red;">${message}</p>`;
  }

 // In WeatherApp.js, update the displayWeather method:
 displayWeather(data) {
  const box = document.getElementById("weatherResult");
  box.classList.remove("d-none");
  
  this.applyWeatherTheme(data.weather[0].main);
  
  const iconPath = this.getAnimatedIconPath(data.weather[0].icon, data.weather[0].main);
  
  box.innerHTML = `
    <h5>${data.name}, ${data.sys.country}</h5>
    <img src="${iconPath}" class="animated-icon">
    <p><strong>${data.weather[0].main}</strong>: ${data.weather[0].description}</p>
    <p>Temperature: ${data.main.temp}° ${this.unit}</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind: ${data.wind.speed} ${this.unit === "C" ? "m/s" : "mph"}</p>
  `;
}

// Add this new method to map OpenWeatherMap icons to your animated icons
getAnimatedIconPath(owmIconCode, weatherMain) {
  const isDay = owmIconCode.endsWith('d');
  
  // Map OpenWeatherMap conditions to your animated icons
  const iconMap = {
    '01': isDay ? 'animated-icons/day.svg' : 'animated-icons/night.svg',
    '02': isDay ? 'animated-icons/cloudy-day-1.svg' : 'animated-icons/cloudy-night-1.svg',
    '03': 'animated-icons/cloudy.svg',
    '04': 'animated-icons/cloudy.svg',
    '09': 'animated-icons/rainy-4.svg',
    '10': isDay ? 'animated-icons/rainy-2.svg' : 'animated-icons/rainy-5.svg',
    '11': 'animated-icons/thunder.svg',
    '13': 'animated-icons/snowy-3.svg',
    '50': 'animated-icons/cloudy.svg'
  };
  
  // Fallback for weather main if icon code doesn't match
  const weatherMainMap = {
    'Clear': isDay ? 'animated-icons/day.svg' : 'animated-icons/night.svg',
    'Clouds': isDay ? 'animated-icons/cloudy-day-2.svg' : 'animated-icons/cloudy-night-2.svg',
    'Rain': isDay ? 'animated-icons/rainy-3.svg' : 'animated-icons/rainy-6.svg',
    'Drizzle': 'animated-icons/rainy-1.svg',
    'Thunderstorm': 'animated-icons/thunder.svg',
    'Snow': 'animated-icons/snowy-6.svg',
    'Mist': 'animated-icons/cloudy.svg',
    'Fog': 'animated-icons/cloudy.svg'
  };
  
  const iconPrefix = owmIconCode.substring(0, 2);
  return iconMap[iconPrefix] || weatherMainMap[weatherMain] || 'animated-icons/day.svg';
}

 // In WeatherApp.js, update displayForecast
async displayForecast(city) {
  try {
    const data = await this.weatherService.get5DayForecastByCity(city);
    const forecastContainer = document.getElementById("forecastCards");
    forecastContainer.innerHTML = "";
    document.getElementById("forecastResult").classList.remove("d-none");

    const daily = {};
    data.list.forEach(entry => {
      const date = entry.dt_txt.split(" ")[0];
      if (!daily[date]) daily[date] = [];
      daily[date].push(entry);
    });

    Object.keys(daily).slice(0, 5).forEach(date => {
      const day = daily[date][0];
      const iconPath = this.getAnimatedIconPath(day.weather[0].icon, day.weather[0].main);
      const card = document.createElement("div");
      card.classList.add("card", "p-2", "m-2", "fade-in");
      card.style.width = "120px";
      card.innerHTML = `
        <h6>${new Date(date).toLocaleDateString()}</h6>
        <img src="${iconPath}" class="animated-icon" style="width:60px;height:60px">
        <p>${day.main.temp.toFixed(1)}° ${this.unit}</p>
        <p style="font-size:0.8em">${day.weather[0].main}</p>
      `;
      forecastContainer.appendChild(card);
    });
  } catch (error) {
    document.getElementById("forecastResult").classList.add("d-none");
  }
}

// Update displayHourlyForecast
displayHourlyForecast(data) {
  try {
    const container = document.getElementById("hourlyCards");
    container.innerHTML = "";
    
    data.list.slice(0, 12).forEach(hour => { // Changed from 8 to 12
      const time = new Date(hour.dt * 1000).toLocaleTimeString([], { hour: 'numeric' });
      const iconPath = this.getAnimatedIconPath(hour.weather[0].icon, hour.weather[0].main);
      const card = document.createElement("div");
      card.className = "hourly-card";
      card.innerHTML = `
        <div class="hour-time">${time}</div>
        <img src="${iconPath}" alt="${hour.weather[0].description}" style="width:40px;height:40px">
        <div class="hour-temp">${Math.round(hour.main.temp)}°${this.unit}</div>
      `;
      container.appendChild(card);
    });
    
    document.getElementById("hourlyForecast").classList.remove("d-none");
  } catch (error) {
    console.error("Hourly forecast error:", error);
  }
}
applyWeatherTheme(weatherMain) {
  const container = document.getElementById('weatherResult');
  container.className = 'weather-box fade-in'; // Reset classes
  
  // Remove all weather theme classes
  const weatherClasses = ['weather-sunny', 'weather-cloudy', 'weather-rainy', 'weather-thunder', 'weather-snowy'];
  weatherClasses.forEach(c => container.classList.remove(c));
  
  // Add appropriate theme class
  const weatherMainLower = weatherMain.toLowerCase();
  if (weatherMainLower.includes('clear') || weatherMainLower.includes('sun')) {
    container.classList.add('weather-sunny');
  } else if (weatherMainLower.includes('cloud')) {
    container.classList.add('weather-cloudy');
  } else if (weatherMainLower.includes('rain') || weatherMainLower.includes('drizzle')) {
    container.classList.add('weather-rainy');
  } else if (weatherMainLower.includes('thunder')) {
    container.classList.add('weather-thunder');
  } else if (weatherMainLower.includes('snow')) {
    container.classList.add('weather-snowy');
  }
}
}

const app = new WeatherApp();