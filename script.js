const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const message = document.getElementById("message");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");

const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");


const getWeather = async (city) => {

    try {

        // Get latitude and longitude of the city

        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!locationResponse.ok) {
            throw new Error("Unable to find city");
        }

        const locationData = await locationResponse.json();

        if (!locationData.results) {
            throw new Error("City not found");
        }

        const location = locationData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;


        // Get weather information

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather");
        }

        const weatherData = await weatherResponse.json();

        return {
            location,
            weather: weatherData.current
        };

    } catch (error) {

        throw error;

    }
};


const displayWeather = (data) => {

    const { location, weather } = data;

    cityName.textContent =
        `${location.name}, ${location.country}`;

    temperature.textContent =
        `${Math.round(weather.temperature_2m)} °C`;

    humidity.textContent =
        `${weather.relative_humidity_2m}%`;

    windSpeed.textContent =
        `${Math.round(weather.wind_speed_10m)} km/h`;


    const weatherCodes = {

        0: "Clear Sky",

        1: "Mainly Clear",

        2: "Partly Cloudy",

        3: "Overcast",

        45: "Fog",

        48: "Fog",

        51: "Light Drizzle",

        53: "Drizzle",

        55: "Heavy Drizzle",

        61: "Light Rain",

        63: "Rain",

        65: "Heavy Rain",

        71: "Light Snow",

        73: "Snow",

        75: "Heavy Snow",

        80: "Rain Showers",

        81: "Rain Showers",

        82: "Heavy Rain Showers",

        95: "Thunderstorm",

        96: "Thunderstorm",

        99: "Thunderstorm"

    };


    condition.textContent =
        weatherCodes[weather.weather_code] || "Unknown";
};


const searchWeather = async () => {

    const city = cityInput.value.trim();

    if (city === "") {

        message.textContent =
            "Please enter a city name.";

        return;
    }


    message.textContent = "Loading...";


    try {

        const data = await getWeather(city);

        displayWeather(data);

        message.textContent = "";

    } catch (error) {

        message.textContent =
            error.message;

    }
};


searchBtn.addEventListener(
    "click",
    searchWeather
);


cityInput.addEventListener(
    "keypress",
    (event) => {

        if (event.key === "Enter") {

            searchWeather();

        }

    }
);