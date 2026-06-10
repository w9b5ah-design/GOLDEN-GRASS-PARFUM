// Weather Dashboard Application
// Using OpenWeatherMap API (Free tier)

class WeatherDashboard {
    constructor() {
        // OpenWeatherMap API configuration
        // Free API key - Replace with your own from https://openweathermap.org/api
        this.apiKey = 'demo'; // Using demo mode - see setup instructions
        this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
        this.unit = 'metric'; // Celsius

        // DOM Elements
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.locationBtn = document.getElementById('locationBtn');
        this.errorMessage = document.getElementById('errorMessage');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.weatherContent = document.getElementById('weatherContent');
        this.welcomeState = document.getElementById('welcomeState');

        this.init();
    }

    init() {
        this.attachEventListeners();
        this.loadLastSearchedCity();
    }

    attachEventListeners() {
        this.searchBtn.addEventListener('click', () => this.searchCity());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchCity();
        });
        this.locationBtn.addEventListener('click', () => this.getCurrentLocation());
    }

    /**
     * Search weather by city name
     */
    searchCity() {
        const city = this.cityInput.value.trim();
        if (!city) {
            this.showError('Please enter a city name!');
            return;
        }

        this.fetchWeatherByCity(city);
    }

    /**
     * Fetch weather data from API
     */
    async fetchWeatherByCity(city) {
        try {
            this.showLoading();
            this.clearError();

            // Using Open-Meteo API (free, no API key required)
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
            
            const geoResponse = await fetch(geoUrl);
            const geoData = await geoResponse.json();

            if (!geoData.results || geoData.results.length === 0) {
                this.showError('City not found. Please try another search.');
                this.hideLoading();
                return;
            }

            const location = geoData.results[0];
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,cloud_cover,visibility&timezone=auto`;

            const weatherResponse = await fetch(weatherUrl);
            const weatherData = await weatherResponse.json();

            this.displayWeather(location, weatherData.current);
            this.saveLastSearchedCity(city);
            this.hideLoading();

        } catch (error) {
            console.error('Error fetching weather:', error);
            this.showError('Error fetching weather data. Please try again.');
            this.hideLoading();
        }
    }

    /**
     * Get user's current location weather
     */
    getCurrentLocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by your browser.');
            return;
        }

        this.showLoading();
        navigator.geolocation.getCurrentPosition(
            (position) => this.fetchWeatherByCoordinates(position.coords),
            (error) => {
                this.hideLoading();
                this.showError('Unable to access your location.');
            }
        );
    }

    /**
     * Fetch weather by latitude and longitude
     */
    async fetchWeatherByCoordinates(coords) {
        try {
            const { latitude, longitude } = coords;
            
            // Reverse geocoding to get city name
            const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
            const geoResponse = await fetch(geoUrl);
            const geoData = await geoResponse.json();

            // Fetch weather data
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,cloud_cover,visibility&timezone=auto`;
            const weatherResponse = await fetch(weatherUrl);
            const weatherData = await weatherResponse.json();

            const location = {
                name: geoData.address?.city || geoData.address?.town || 'Current Location',
                country: geoData.address?.country,
                latitude: latitude,
                longitude: longitude
            };

            this.displayWeather(location, weatherData.current);
            this.hideLoading();

        } catch (error) {
            console.error('Error fetching location weather:', error);
            this.showError('Error fetching weather for your location.');
            this.hideLoading();
        }
    }

    /**
     * Display weather information on the page
     */
    displayWeather(location, current) {
        // Update location info
        document.getElementById('cityName').textContent = `${location.name}${location.country ? ', ' + location.country : ''}`;
        document.getElementById('dateTime').textContent = new Date().toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Get weather icon based on weather code
        const weatherIcon = this.getWeatherIcon(current.weather_code);
        document.getElementById('weatherIcon').src = weatherIcon;

        // Update temperature and description
        document.getElementById('temperature').textContent = Math.round(current.temperature_2m);
        document.getElementById('weatherDesc').textContent = this.getWeatherDescription(current.weather_code);
        document.getElementById('feelsLike').textContent = `Feels like ${Math.round(current.apparent_temperature)}°C`;

        // Update details
        document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;
        document.getElementById('windSpeed').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
        document.getElementById('windDirection').textContent = this.getWindDirection(current.wind_direction_10m);
        document.getElementById('pressure').textContent = `${Math.round(current.pressure_msl)} mb`;
        document.getElementById('visibility').textContent = `${(current.visibility / 1000).toFixed(1)} km`;
        document.getElementById('clouds').textContent = `${current.cloud_cover}%`;

        // Show content and hide welcome state
        this.weatherContent.classList.remove('hidden');
        this.welcomeState.classList.add('hidden');
    }

    /**
     * Get weather icon URL based on weather code (WMO)
     */
    getWeatherIcon(code) {
        // Using emoji representation or weather icon URLs
        const iconMap = {
            0: '☀️',     // Clear sky
            1: '🌤️',    // Mainly clear
            2: '⛅',     // Partly cloudy
            3: '☁️',     // Overcast
            45: '🌫️',   // Foggy
            48: '🌫️',   // Depositing rime fog
            51: '🌧️',   // Light drizzle
            53: '🌧️',   // Moderate drizzle
            55: '🌧️',   // Dense drizzle
            61: '🌧️',   // Slight rain
            63: '🌧️',   // Moderate rain
            65: '🌧️',   // Heavy rain
            71: '❄️',    // Slight snow
            73: '❄️',    // Moderate snow
            75: '❄️',    // Heavy snow
            80: '🌧️',   // Slight rain showers
            81: '🌧️',   // Moderate rain showers
            82: '🌧️',   // Violent rain showers
            85: '❄️',    // Slight snow showers
            86: '❄️',    // Heavy snow showers
            95: '⛈️'     // Thunderstorm
        };

        // Return emoji or use OpenWeather icon
        return this.emojiToImage(iconMap[code] || '🌤️');
    }

    /**
     * Get weather description from weather code
     */
    getWeatherDescription(code) {
        const descriptions = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Foggy',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            71: 'Slight snow',
            73: 'Moderate snow',
            75: 'Heavy snow',
            80: 'Slight rain showers',
            81: 'Moderate rain showers',
            82: 'Violent rain showers',
            85: 'Slight snow showers',
            86: 'Heavy snow showers',
            95: 'Thunderstorm'
        };

        return descriptions[code] || 'Unknown';
    }

    /**
     * Convert wind direction degrees to cardinal direction
     */
    getWindDirection(degrees) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                           'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round((degrees % 360) / 22.5) % 16;
        return directions[index];
    }

    /**
     * Convert emoji to SVG image for better rendering
     */
    emojiToImage(emoji) {
        // Create SVG with emoji
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90" font-weight="bold">${emoji}</text></svg>`;
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }

    /**
     * Show error message
     */
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.add('show');
        setTimeout(() => {
            this.errorMessage.classList.remove('show');
        }, 5000);
    }

    /**
     * Clear error message
     */
    clearError() {
        this.errorMessage.classList.remove('show');
    }

    /**
     * Show loading spinner
     */
    showLoading() {
        this.loadingSpinner.classList.remove('hidden');
    }

    /**
     * Hide loading spinner
     */
    hideLoading() {
        this.loadingSpinner.classList.add('hidden');
    }

    /**
     * Save last searched city to local storage
     */
    saveLastSearchedCity(city) {
        try {
            localStorage.setItem('lastSearchedCity', city);
        } catch (error) {
            console.error('Error saving to local storage:', error);
        }
    }

    /**
     * Load and display last searched city
     */
    loadLastSearchedCity() {
        try {
            const lastCity = localStorage.getItem('lastSearchedCity');
            if (lastCity) {
                this.cityInput.value = lastCity;
                // Optionally auto-load: this.fetchWeatherByCity(lastCity);
            }
        } catch (error) {
            console.error('Error loading from local storage:', error);
        }
    }
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new WeatherDashboard();
    });
} else {
    new WeatherDashboard();
}