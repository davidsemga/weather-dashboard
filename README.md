# Weather Dashboard

A sleek, minimalist React weather dashboard that shows current weather and a 5-day forecast. Includes Fahrenheit support, smooth animations, dark mode, and recent city history. Messing  around with API integration and stuff. It's my first time :)

## Features
- Search for any city’s weather
- 5-day forecast visualization
- Use geolocation to get current location weather
- Dark / Light mode toggle
- Recent cities history with localStorage
- Smooth fade/slide animations for a polished UI
- Fully responsive and minimalist design


## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/weather-dashboard.git
cd weather-dashboard

```
2. Install dependencies:
```bash
npm install

```
3. Create a .env file in the project root:
```bash
REACT_APP_WEATHER_KEY=your_openweather_api_key

```
4. Start the dev server:
```bash
npm start

```
5. Open http://localhost:3000 to view the app in your browser.


## Deployment

Vercel: Add REACT_APP_WEATHER_KEY as an environment variable in Project Settings.

Netlify: Add REACT_APP_WEATHER_KEY under Site Settings → Build & Deploy → Environment.

## Technologies Used

React – for building the user interface

Recharts – for 5-day forecast chart visualization

OpenWeather API – for weather data

CSS Animations – for smooth transitions and effects

