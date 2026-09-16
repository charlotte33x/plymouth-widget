import requests
import json
import os
import arrow

API_KEY = os.environ["STORMGLASS_API_KEY"]

LAT = 50.3755
LNG = -4.1427

start = arrow.now().floor("day")
end = arrow.now().shift(days=2).floor("day")

headers = {
    "Authorization": API_KEY
}

# Tide extremes
tides_response = requests.get(
    "https://api.stormglass.io/v2/tide/extremes/point",
    headers=headers,
    params={
        "lat": LAT,
        "lng": LNG,
        "start": start.to("UTC").timestamp(),
        "end": end.to("UTC").timestamp()
    }
)

tides_data = tides_response.json()

# Water temperature
water_response = requests.get(
    "https://api.stormglass.io/v2/weather/point",
    headers=headers,
    params={
        "lat": LAT,
        "lng": LNG,
        "params": "waterTemperature"
    }
)

water_data = water_response.json()

output = {
    "seaTemperature": water_data["hours"][0]["waterTemperature"]["sg"],
    "tides": tides_data["data"]
}

with open("data/tides.json", "w") as f:
    json.dump(output, f, indent=2)
