# Weather Map

Weather Map is a web application that allows users to retrieve and display current weather information for a given city or location. It leverages the OpenWeatherMap API for weather data and Google Maps API for map functionality.

## Features

1. **Current Weather Information:**
   - Users can enter a city name or click on the map to get the current weather information.
   - The application displays details such as temperature, weather description, humidity, wind speed, and more.

2. **Extended Forecast:**
   - Users can request an extended 14-day weather forecast for a specific city or location.
   - The extended forecast includes maximum and minimum temperatures, wind direction, and sunrise/sunset times for each day.

3. **Language Translation:**
   - The application translates the weather description into Russian using the Google Translate API.

4. **Country Information:**
   - Country information, including the country flag, is fetched from the Restcountries API based on the country code received from the OpenWeatherMap API.

## Prerequisites

- Node.js
- npm (Node Package Manager)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/weather-map.git
   
## Usage
1. Start the server:

```bash
node app.js

2. Visit http://localhost:3000 in your web browser.

Enter a city name or click on the map to get the current weather information.

Click the "Get Extended Forecast" button to retrieve a 14-day extended weather forecast.

## Libraries and APIs
OpenWeatherMap API for weather data
Google Maps JavaScript API for map functionality
Google Translate API for language translation
Restcountries API for country information
