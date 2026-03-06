// DOM Elements
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherDisplay = document.getElementById('weather-display');

// Your OpenWeatherMap API Key
const API_KEY = '656e349a71cd626fef348632d9a49ba5';  // Replace with your actual API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Function to fetch weather data using async/await
async function getWeather(city) {
    // Show loading state
    showLoading();

    // Disable search button while loading
    searchBtn.disabled = true;
    searchBtn.textContent = 'Searching...';

    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await axios.get(url);
        // Success! We got the data
        console.log('Weather Data:', response.data);
        displayWeather(response.data);
    } catch (error) {
        // Something went wrong
        console.error('Error fetching weather:', error);

        if (error.response && error.response.status === 404) {
            showError('City not found. Please check the spelling and try again.');
        } else {
            showError('Something went wrong. Please try again later.');
        }
    } finally {
        // Re-enable button
        searchBtn.disabled = false;
        searchBtn.innerHTML = '🔍 Search';
        // Focus back on input for convenience
        cityInput.focus();
    }
}

// Function to display weather data
function displayWeather(data) {
    // Extract the data we need
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    // Create HTML to display
    const weatherHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;

    // Put it on the page
    weatherDisplay.innerHTML = weatherHTML;

    // Focus back on input
    cityInput.focus();
}

// Function to show loading state
function showLoading() {
    weatherDisplay.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading weather data...</p>
        </div>
    `;
}

// Function to show error message
function showError(message) {
    weatherDisplay.innerHTML = `
        <div class="error-message">
            <h3>⚠️ Error</h3>
            <p>${message}</p>
        </div>
    `;
}

// Event Listeners
searchBtn.addEventListener('click', function () {
    handleSearch();
});

cityInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

function handleSearch() {
    const city = cityInput.value.trim();

    // Validation
    if (!city) {
        showError('Please enter a city name.');
        return;
    }

    if (city.length < 2) {
        showError('City name too short. Please enter at least 2 characters.');
        return;
    }

    getWeather(city);
    // Clear input after search
    cityInput.value = '';
}

// Initial Page Load - Welcome Message
weatherDisplay.innerHTML = `
    <div class="welcome-message">
        <p>🌍 Enter a city name above to get started!</p>
    </div>
`;