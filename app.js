/**
 * WeatherApp Constructor
 * @param {string} apiKey - OpenWeatherMap API Key
 */
function WeatherApp(apiKey) {
    // API Configurations
    this.apiKey = apiKey;
    this.apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    this.forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

    // DOM Elements
    this.searchBtn = document.getElementById('search-btn');
    this.cityInput = document.getElementById('city-input');
    this.weatherDisplay = document.getElementById('weather-display');
    this.recentSearchesSection = document.getElementById('recent-searches-section');
    this.recentSearchesContainer = document.getElementById('recent-searches-container');
    this.clearBtn = document.getElementById('clear-history-btn');

    // Recent Searches State
    this.recentSearches = [];
    this.maxRecentSearches = 5;

    // Initialize App
    this.init();
}

/**
 * Initialize the application, setting up event listeners and UI
 */
WeatherApp.prototype.init = function () {
    // Event Listeners - using .bind(this) to maintain context
    this.searchBtn.addEventListener('click', this.handleSearch.bind(this));

    this.cityInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            this.handleSearch();
        }
    }.bind(this));

    if (this.clearBtn) {
        this.clearBtn.addEventListener('click', this.clearHistory.bind(this));
    }

    // Load saved data
    this.loadRecentSearches();
    this.loadLastCity();
};

/**
 * Handle the search input and trigger weather fetching
 */
WeatherApp.prototype.handleSearch = function () {
    const city = this.cityInput.value.trim();

    // Validation
    if (!city) {
        this.showError('Please enter a city name.');
        return;
    }

    if (city.length < 2) {
        this.showError('City name too short. Please enter at least 2 characters.');
        return;
    }

    // Trigger API call
    this.getWeather(city);

    // Clear input and focus
    this.cityInput.value = '';
    this.cityInput.focus();
};

/**
 * Fetch both current weather and forecast simultaneously
 * @param {string} city 
 */
WeatherApp.prototype.getWeather = async function (city) {
    // Show loading state
    this.showLoading();

    // Disable search controls
    this.searchBtn.disabled = true;
    this.searchBtn.textContent = 'Searching...';

    const currentWeatherUrl = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`;
    const forecastUrl = `${this.forecastUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

    try {
        // Fetch both simultaneously using Promise.all()
        const [currentWeatherRes, forecastRes] = await Promise.all([
            axios.get(currentWeatherUrl),
            axios.get(forecastUrl)
        ]);

        // Success! Display both
        this.displayWeather(currentWeatherRes.data);
        this.displayForecast(forecastRes.data);

        // Save successful search
        this.saveRecentSearch(city);
        localStorage.setItem('lastCity', city);

    } catch (error) {
        console.error('Error fetching data:', error);

        if (error.response && error.response.status === 404) {
            this.showError('City not found. Please check the spelling and try again.');
        } else {
            this.showError('Something went wrong while fetching weather data. Please try again later.');
        }
    } finally {
        // Re-enable controls
        this.searchBtn.disabled = false;
        this.searchBtn.innerHTML = '🔍 Search';
        this.cityInput.focus();
    }
};

/**
 * Display current weather information
 * @param {object} data 
 */
WeatherApp.prototype.displayWeather = function (data) {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const weatherHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;

    this.weatherDisplay.innerHTML = weatherHTML;
};

/**
 * Filter 40 forecast points into 5 daily forecasts (around noon)
 * @param {object} data 
 * @returns {Array}
 */
WeatherApp.prototype.processForecastData = function (data) {
    // Filter to get records closest to 12:00:00 for each day
    const dailyForecasts = data.list.filter(item => {
        return item.dt_txt.includes('12:00:00');
    });

    // Return first 5 days
    return dailyForecasts.slice(0, 5);
};

/**
 * Display the 5-day forecast grid
 * @param {object} data 
 */
WeatherApp.prototype.displayForecast = function (data) {
    const dailyForecasts = this.processForecastData(data);

    const forecastCardsHTML = dailyForecasts.map(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const temp = Math.round(day.main.temp);
        const description = day.weather[0].description;
        const icon = day.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        return `
            <div class="forecast-card">
                <h4 class="forecast-day">${dayName}</h4>
                <img src="${iconUrl}" alt="${description}" class="forecast-icon">
                <div class="forecast-temp">${temp}°C</div>
                <p class="forecast-desc">${description}</p>
            </div>
        `;
    }).join('');

    const forecastSectionHTML = `
        <div class="forecast-section">
            <h3 class="forecast-title">5-Day Forecast</h3>
            <div class="forecast-container">
                ${forecastCardsHTML}
            </div>
        </div>
    `;

    // Append to the current weather display
    this.weatherDisplay.innerHTML += forecastSectionHTML;
};

/**
 * UI Method: Show loading state
 */
WeatherApp.prototype.showLoading = function () {
    this.weatherDisplay.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Fetching weather insights...</p>
        </div>
    `;
};

/**
 * UI Method: Show error message
 * @param {string} message 
 */
WeatherApp.prototype.showError = function (message) {
    this.weatherDisplay.innerHTML = `
        <div class="error-message">
            <h3>⚠️ Error</h3>
            <p>${message}</p>
        </div>
    `;
};

/**
 * UI Method: Show initial welcome message
 */
WeatherApp.prototype.showWelcome = function () {
    this.weatherDisplay.innerHTML = `
        <div class="welcome-message">
            <h2>🌍 Welcome to SkyFetch</h2>
            <p>Start your journey by searching for a city above!</p>
            <p style="font-size: 0.9rem; margin-top: 15px; opacity: 0.8;">
                Try searching for: London, New York, or Tokyo
            </p>
        </div>
    `;
};

/**
 * Persistence: Load recent searches from localStorage
 */
WeatherApp.prototype.loadRecentSearches = function () {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
        this.recentSearches = JSON.parse(saved);
        this.displayRecentSearches();
    }
};

/**
 * Persistence: Save a new city to recent searches
 * @param {string} city 
 */
WeatherApp.prototype.saveRecentSearch = function (city) {
    // title case
    const cityName = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

    // Remove duplicates
    const index = this.recentSearches.indexOf(cityName);
    if (index > -1) {
        this.recentSearches.splice(index, 1);
    }

    // Add to front
    this.recentSearches.unshift(cityName);

    // Limit size
    if (this.recentSearches.length > this.maxRecentSearches) {
        this.recentSearches.pop();
    }

    // Persist
    localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
    this.displayRecentSearches();
};

/**
 * UI: Render recent search buttons
 */
WeatherApp.prototype.displayRecentSearches = function () {
    this.recentSearchesContainer.innerHTML = '';

    if (this.recentSearches.length === 0) {
        this.recentSearchesSection.style.display = 'none';
        return;
    }

    this.recentSearchesSection.style.display = 'block';

    this.recentSearches.forEach(city => {
        const btn = document.createElement('button');
        btn.className = 'recent-search-btn';
        btn.textContent = city;
        btn.onclick = () => {
            this.cityInput.value = ''; // Clear input if button clicked
            this.getWeather(city);
        };
        this.recentSearchesContainer.appendChild(btn);
    });
};

/**
 * Persistence: Load last searched city on startup
 */
WeatherApp.prototype.loadLastCity = function () {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        this.getWeather(lastCity);
    } else {
        this.showWelcome();
    }
};

/**
 * Persistence: Clear all history
 */
WeatherApp.prototype.clearHistory = function () {
    if (confirm('Are you sure you want to clear your search history?')) {
        this.recentSearches = [];
        localStorage.removeItem('recentSearches');
        localStorage.removeItem('lastCity');
        this.displayRecentSearches();
        this.showWelcome();
    }
};

// Initialize the application with the API key
const app = new WeatherApp('656e349a71cd626fef348632d9a49ba5');