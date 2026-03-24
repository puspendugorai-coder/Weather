import os
from flask import Flask, render_template, request, jsonify
import urllib.request
import urllib.parse
import json

app = Flask(__name__)

# Reads API_KEY from HF Space Secrets (Settings → Variables and Secrets)
API_KEY = os.environ.get("API_KEY", "91f8e1dd1bff9a1f050f13d8530a4ce1")

AQI_LABELS = {1: "Good", 2: "Fair", 3: "Moderate", 4: "Poor", 5: "Very Poor"}
AQI_COLORS = {
    1: "#4ADE80",
    2: "#2DD4BF",
    3: "#FACC15",
    4: "#FB923C",
    5: "#F87171",
}

WEATHER_ICONS = {
    "Clear":        "☀️",
    "Clouds":       "☁️",
    "Rain":         "🌧️",
    "Drizzle":      "🌦️",
    "Thunderstorm": "⛈️",
    "Snow":         "❄️",
    "Mist":         "🌫️",
    "Fog":          "🌫️",
    "Haze":         "🌁",
    "Smoke":        "🌫️",
    "Dust":         "🌪️",
    "Sand":         "🌪️",
    "Ash":          "🌋",
    "Squall":       "💨",
    "Tornado":      "🌪️",
}


def fetch_json(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": "AtmosWeatherApp/1.0"})
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read().decode())


def get_weather(city: str) -> dict:
    enc = urllib.parse.quote(city)
    weather_url = (
        f"https://api.openweathermap.org/data/2.5/weather"
        f"?q={enc}&appid={API_KEY}&units=metric"
    )
    w = fetch_json(weather_url)
    if w.get("cod") != 200:
        raise ValueError(w.get("message", "City not found"))

    lat, lon = w["coord"]["lat"], w["coord"]["lon"]
    aqi_url = (
        f"https://api.openweathermap.org/data/2.5/air_pollution"
        f"?lat={lat}&lon={lon}&appid={API_KEY}"
    )
    a = fetch_json(aqi_url)

    aqi_index  = a["list"][0]["main"]["aqi"]
    components = a["list"][0]["components"]

    deg = w["wind"].get("deg", 0)
    dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    wind_dir = dirs[round(deg / 45) % 8]
    condition = w["weather"][0]["main"]

    return {
        "city":        w["name"],
        "country":     w["sys"]["country"],
        "temp":        round(w["main"]["temp"], 1),
        "feels_like":  round(w["main"]["feels_like"], 1),
        "temp_min":    round(w["main"]["temp_min"], 1),
        "temp_max":    round(w["main"]["temp_max"], 1),
        "humidity":    w["main"]["humidity"],
        "condition":   condition,
        "description": w["weather"][0]["description"].title(),
        "icon":        WEATHER_ICONS.get(condition, "🌡️"),
        "wind_speed":  round(w["wind"]["speed"] * 3.6, 1),
        "wind_deg":    deg,
        "wind_dir":    wind_dir,
        "visibility":  round(w.get("visibility", 0) / 1000, 1),
        "pressure":    w["main"]["pressure"],
        "aqi":         aqi_index,
        "aqi_label":   AQI_LABELS[aqi_index],
        "aqi_color":   AQI_COLORS[aqi_index],
        "pm2_5":       round(components.get("pm2_5", 0), 1),
        "pm10":        round(components.get("pm10",  0), 1),
        "o3":          round(components.get("o3",    0), 1),
        "no2":         round(components.get("no2",   0), 1),
        "co":          round(components.get("co",    0), 1),
        "so2":         round(components.get("so2",   0), 1),
    }


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/weather")
def weather():
    city = request.args.get("city", "").strip()
    if not city:
        return jsonify({"error": "Please enter a city name."}), 400
    if not API_KEY:
        return jsonify({"error": "API key not set. Add API_KEY as a Space Secret in Settings."}), 500
    try:
        data = get_weather(city)
        return jsonify(data)
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": f"Network error: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7860, debug=False)
