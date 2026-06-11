<div align="center">

# 🌤️ Atmos — Weather & Air Quality Dashboard

**Real-time weather and air quality data for any city in the world.**

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.x-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![OpenWeatherMap](https://img.shields.io/badge/OpenWeatherMap-API-orange?style=for-the-badge&logo=OpenWeatherMap&logoColor=white)](https://openweathermap.org/api)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[🚀 Live Demo](https://weather-ld55.onrender.com) · [🐛 Report Bug](https://github.com/puspendugorai-coder/Weather/issues) · [✨ Request Feature](https://github.com/puspendugorai-coder/Weather/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Setup](#local-setup)
  - [Docker Setup](#docker-setup)
- [API Reference](#-api-reference)
- [Configuration](#-configuration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌐 Overview

**Atmos** is a lightweight, real-time weather dashboard that provides comprehensive atmospheric data for any city worldwide. Built with Flask and powered by the OpenWeatherMap API, it delivers instant weather conditions, detailed air quality metrics, and key environmental indicators in a clean, intuitive interface.

> 🔗 **Live Demo:** [https://weather-wcan.onrender.com](https://weather-wcan.onrender.com)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌡️ **Current Weather** | Temperature, feels-like, min/max, humidity, and pressure |
| 💨 **Wind Details** | Speed (km/h), direction (N/S/E/W), and degree bearing |
| 👁️ **Visibility** | Real-time visibility in kilometres |
| 🌫️ **Air Quality Index** | AQI level with colour-coded labels (Good → Very Poor) |
| 🧪 **Pollutant Breakdown** | PM2.5, PM10, O₃, NO₂, CO, and SO₂ concentrations |
| 🌦️ **Weather Icons** | Emoji-based condition icons for 15+ weather states |
| 📱 **Responsive UI** | Works seamlessly on desktop and mobile browsers |
| ⚡ **Fast & Lightweight** | No heavy framework — pure Flask with minimal dependencies |
| 🐳 **Docker Ready** | One-command containerised deployment |

---

## 🛠️ Tech Stack

- **Backend:** Python 3.11, Flask
- **API:** OpenWeatherMap (Current Weather + Air Pollution endpoints)
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Containerisation:** Docker
- **Deployment:** Render / Hugging Face Spaces

---

## 📁 Project Structure

```
Weather/
├── app.py                  # Flask app — routes, API calls, data processing
├── requirements.txt        # Python dependencies
├── Dockerfile              # Docker container configuration
├── templates/
│   └── index.html          # Main UI template
└── static/
    ├── css/                # Stylesheets
    └── js/                 # Client-side scripts
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.9 or higher
- A free [OpenWeatherMap API key](https://openweathermap.org/appid)
- Docker (optional, for containerised setup)

---

### Local Setup

**1. Clone the repository**

```bash
git clone https://github.com/puspendugorai-coder/Weather.git
cd Weather
```

**2. Create and activate a virtual environment**

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

**3. Install dependencies**

```bash
pip install -r requirements.txt
```

**4. Set your API key**

```bash
# Windows (Command Prompt)
set API_KEY=your_openweathermap_api_key

# macOS / Linux
export API_KEY=your_openweathermap_api_key
```

**5. Run the app**

```bash
python app.py
```

Open your browser and navigate to **[http://localhost:7860](http://localhost:7860)**

---

### Docker Setup

**1. Build the Docker image**

```bash
docker build -t atmos-weather .
```

**2. Run the container**

```bash
docker run -p 7860:7860 -e API_KEY=your_openweathermap_api_key atmos-weather
```

Open your browser and navigate to **[http://localhost:7860](http://localhost:7860)**

---

## 📡 API Reference

### `GET /weather`

Fetches weather and air quality data for a given city.

**Query Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `city` | `string` | ✅ Yes | Name of the city to query |

**Example Request**

```
GET /weather?city=London
```

**Example Response**

```json
{
  "city": "London",
  "country": "GB",
  "temp": 15.3,
  "feels_like": 14.1,
  "temp_min": 12.8,
  "temp_max": 17.0,
  "humidity": 72,
  "condition": "Clouds",
  "description": "Overcast Clouds",
  "icon": "☁️",
  "wind_speed": 18.4,
  "wind_dir": "SW",
  "visibility": 10.0,
  "pressure": 1012,
  "aqi": 2,
  "aqi_label": "Fair",
  "aqi_color": "#2DD4BF",
  "pm2_5": 8.3,
  "pm10": 14.2,
  "o3": 62.1,
  "no2": 21.5,
  "co": 215.4,
  "so2": 3.1
}
```

**Error Responses**

| Status | Meaning |
|---|---|
| `400` | No city name provided |
| `404` | City not found |
| `500` | API key missing or network error |

---

## ⚙️ Configuration

The app reads configuration from environment variables:

| Variable | Description | Required |
|---|---|---|
| `API_KEY` | Your OpenWeatherMap API key | ✅ Yes |

> **Hugging Face Spaces:** Add your key via **Settings → Variables and Secrets → New Secret**, with the name `API_KEY`.

---

## 🌍 Deployment

### Render

1. Push this repository to GitHub.
2. Create a new **Web Service** on [Render](https://render.com).
3. Connect your repository and set the start command to:
   ```
   python app.py
   ```
4. Add `API_KEY` as an Environment Variable in the Render dashboard.

### Hugging Face Spaces

1. Create a new Space with **Docker** as the SDK.
2. Push the repository files to your Space.
3. Add `API_KEY` via **Settings → Variables and Secrets**.

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

Please make sure your code follows the existing style and includes appropriate comments.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by [Puspendu Gorai](https://github.com/puspendugorai-coder)

⭐ **Star this repo if you found it helpful!**

</div>
