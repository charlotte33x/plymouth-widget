import requests
import json
import os
import arrow

API_KEY = os.environ["STORMGLASS_API_KEY"]

LAT = 50.3755
LNG = -4.1427

start = arrow.now().floor("day")
end = arrow.now().shift(days=2).floor("day")

response = requests.get(
    "https://api.stormglass.io/v2/tide/extremes/point",
    headers={
        "Authorization": API_KEY
    },
    params={
        "lat": LAT,
        "lng": LNG,
        "start": start.to("UTC").timestamp(),
        "end": end.to("UTC").timestamp()
    }
)

data = response.json()

with open("data/tides.json", "w") as f:
    json.dump(data, f, indent=2)
