# Weather Dashboard

A modern, responsive weather dashboard application that fetches real-time weather data from public APIs.

## 🌤️ Features

- **Real-time Weather Data**: Fetches current weather information from Open-Meteo API (free, no API key required)
- **City Search**: Search weather for any city worldwide
- **Geolocation**: Get weather for your current location
- **Comprehensive Weather Details**:
  - Temperature and "feels like" temperature
  - Humidity and pressure
  - Wind speed and direction
  - Cloud coverage
  - Visibility
  - Sunrise and sunset times (future enhancement)
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Local Storage**: Remembers last searched city
- **Error Handling**: User-friendly error messages
- **Beautiful UI**: Modern gradient design with smooth animations

## 🚀 Getting Started

### Prerequisites
- Modern web browser with JavaScript enabled
- Internet connection for API calls

### Installation

1. Clone or download the repository
2. Navigate to the `weather-dashboard` directory
3. Open `index.html` in your web browser

```bash
cd weather-dashboard
open index.html  # macOS
# or
start index.html  # Windows
# or
xdg-open index.html  # Linux
```

## 📡 APIs Used

### Primary: Open-Meteo API
- **Website**: https://open-meteo.com/
- **Benefits**: 
  - Free tier with no API key required
  - Excellent uptime and reliability
  - No rate limiting for moderate usage
  - Returns current weather and forecast data

### Secondary: Nominatim (OpenStreetMap)
- **Website**: https://nominatim.org/
- **Purpose**: Reverse geocoding (coordinates to city name)
- **Benefits**: Free, open-source, no API key required

### Geocoding: Open-Meteo Geocoding API
- **Purpose**: Convert city names to coordinates
- **Benefits**: Integrated with weather API, no API key required

## 🔧 How to Use

### Search by City
1. Enter a city name in the search box
2. Click "Search" or press Enter
3. Weather information will be displayed

### Use Current Location
1. Click the location button (📍)
2. Allow browser access to your location
3. Weather for your current location will be displayed

### View Weather Details
The dashboard displays:
- Current temperature and conditions
- Humidity percentage
- Wind speed and direction
- Atmospheric pressure
- Visibility distance
- Cloud coverage

## 💾 Local Storage

The application stores:
- Last searched city name (for convenience)
- Data persists across browser sessions

## 🛠️ Customization

### Change Temperature Unit
Currently set to Celsius. To change:

```javascript
this.unit = 'imperial'; // For Fahrenheit
```

### Modify Update Frequency
To auto-refresh weather data:

```javascript
setInterval(() => this.fetchWeatherByCity(lastCity), 600000); // 10 minutes
```

## 📱 Responsive Breakpoints

- **Desktop**: Full-width display with optimized grid
- **Tablet** (≤768px): Adjusted layouts and font sizes
- **Mobile** (≤480px): Single-column layout, simplified grid

## ⚠️ Error Handling

The app includes error handling for:
- Invalid city names
- Network connectivity issues
- Geolocation permission denial
- API unavailability

## 🔒 Security

- No sensitive data stored locally
- All API requests are read-only
- Client-side only (no backend server required)
- No third-party trackers

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers

## 📸 Screenshots

### Desktop View
- Full weather dashboard with all details
- Gradient background and modern styling
- Hover effects and animations

### Mobile View
- Optimized for small screens
- Touch-friendly buttons
- Responsive grid layout

## 🔜 Future Enhancements

- [ ] 7-day forecast
- [ ] Hourly forecast
- [ ] Multiple city tracking
- [ ] Weather alerts
- [ ] Dark mode toggle
- [ ] Temperature unit toggle
- [ ] Weather history
- [ ] Favorite cities
- [ ] Air quality index
- [ ] UV index
- [ ] Pollen count

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## 📞 Support

For issues or questions, please open an issue on the repository.

## 🙏 Acknowledgments

- [Open-Meteo](https://open-meteo.com/) for weather data
- [OpenStreetMap/Nominatim](https://nominatim.org/) for geocoding
- Emoji weather icons

---

**Happy weather checking!** 🌈