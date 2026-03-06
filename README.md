# 🌤️ SkyFetch - Weather Dashboard

A beautiful, interactive weather dashboard that provides real-time weather data and 5-day forecasts for any city in the world.

## ✨ Features

- **🔍 Global Search**: Search weather for any city worldwide using the OpenWeatherMap API.
- **🌡️ Comprehensive Data**: Real-time temperature, weather conditions, and clear visual icons.
- **📊 5-Day Forecast**: Accurate daily predictions organized in a clean, responsive grid.
- **💾 Smart Persistence**: Saves your last 5 searches in `localStorage` for quick access.
- **🔄 Auto-Resume**: Automatically loads the last city you searched for when you return.
- **📱 Fully Responsive**: Optimized for desktops, tablets, and smartphones.
- **⚡ Performance Optimized**: Utilizes concurrent API calls via `Promise.all()` for lightning-fast results.

## 🛠️ Technologies Used

- **HTML5 & CSS3**: Modern layouts using Flexbox, CSS Grid, and custom animations.
- **JavaScript (ES6+)**: Clean, Object-Oriented code using prototypal inheritance.
- **Axios**: Robust HTTP client for handling API requests.
- **OpenWeatherMap API**: Reliable source for global weather data.
- **localStorage API**: Local data persistence for a personalized experience.

## 🎯 Concepts Demonstrated

- **Prototypal Inheritance (OOP)**: Structured application logic using constructors and prototype methods.
- **Async/Await & Promises**: Efficiently handling asynchronous operations and concurrent requests.
- **DOM Manipulation**: Dynamic rendering of weather cards and search history.
- **Event Handling**: Responsive interactions and keyboard accessibility.
- **Data Persistence**: Leveraging browser storage for saving user preferences.

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/04suriya07-spec/skyfetch-weather-dashboard.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd skyfetch-weather-dashboard
   ```
3. **API Key Setup**:
   - Get your free API key from [OpenWeatherMap](https://openweathermap.org/api).
   - In `app.js`, replace the placeholder in `const app = new WeatherApp('YOUR_API_KEY');` with your actual key.
4. **Launch the app**:
   - Simply open `index.html` in any modern web browser.

## 👨‍💻 Author

**Suriya**  
*Full Stack Developer & AI Enthusiast*

---
*Built with ❤️ as part of the Frontend Web Development Advanced Course.*