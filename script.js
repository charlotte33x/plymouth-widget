function getMoonPhase() {

    const today = new Date();

    const knownNewMoon = new Date("2024-01-11");
    const lunarCycle = 29.53;
    const fullMoonAge = 14.77;

    const daysSince =
        (today - knownNewMoon) / (1000 * 60 * 60 * 24);

    const age = daysSince % lunarCycle;
    let tideState = "";

if (age < 4 || age > 25) {
    tideState = "Spring Tide";
}
else if (age > 11 && age < 18) {
    tideState = "Spring Tide";
}
else if (age > 5 && age < 10) {
    tideState = "Neap Tide";
}
else if (age > 19 && age < 24) {
    tideState = "Neap Tide";
}
else {
    tideState = "Transitional";
}

    let phaseName = "";

    if (age < 1) {
        phaseName = "🌑 New Moon";
    } else if (age < 7) {
        phaseName = "🌒 Waxing Crescent";
    } else if (age < 15) {
        phaseName = "🌔 Waxing Gibbous";
    } else if (age < 16) {
        phaseName = "🌕 Full Moon";
    } else if (age < 22) {
        phaseName = "🌖 Waning Gibbous";
    } else {
        phaseName = "🌘 Waning Crescent";
    }

    const illumination =
        ((1 - Math.cos(2 * Math.PI * age / lunarCycle)) / 2) * 100;

    let daysUntilFull;

    if (age <= fullMoonAge) {
        daysUntilFull = fullMoonAge - age;
    } else {
        daysUntilFull =
            (lunarCycle - age + fullMoonAge);
    }

    document.getElementById("moon").innerHTML =
        `
        Phase: ${phaseName}<br>
        Age: ${age.toFixed(1)} days<br>
        Illumination: ${Math.round(illumination)}%<br>
        Next Full Moon: ${daysUntilFull.toFixed(1)} days<br>
        State: ${tideState}
        `;
}
async function loadWeather() {

    const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=50.3755&longitude=-4.1427&current=temperature_2m&daily=temperature_2m_max,temperature_2m_min&forecast_days=3"
    );

    const data = await response.json();

   const tideResponse = await fetch("data/tides.json");
const tideData = await tideResponse.json();

document.getElementById("temperature").innerHTML =
    `
    Air: ${data.current.temperature_2m}°C
    Sea: ${tideData.seaTemperature.toFixed(1)}°C
    `;

    const days = data.daily.time;

    document.getElementById("forecast").innerHTML =
        `
        ${new Date(days[0]).toLocaleDateString('en-GB', { weekday: 'short' })} ${Math.round(data.daily.temperature_2m_max[0])}°
        &nbsp;|&nbsp;
        ${new Date(days[1]).toLocaleDateString('en-GB', { weekday: 'short' })} ${Math.round(data.daily.temperature_2m_max[1])}°
        &nbsp;|&nbsp;
        ${new Date(days[2]).toLocaleDateString('en-GB', { weekday: 'short' })} ${Math.round(data.daily.temperature_2m_max[2])}°
        `;
}
const now = new Date();

document.getElementById("updated").innerHTML =
    `Updated ${now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
    })}`;
async function loadTides() {

    const response = await fetch("data/tides.json");
    const data = await response.json();
   


    const tides = data.tides;
   const now = new Date();

const upcomingTide = tides.find(
    tide => new Date(tide.DateTime) > now
);

const highTides = tides
    .filter(tide => tide.EventType === "HighWater")
    .slice(0, 2);

const lowTides = tides
    .filter(tide => tide.EventType === "LowWater")
    .slice(0, 2);

const sortedTides = tides
    .map(t => ({
        ...t,
        time: new Date(t.DateTime)
    }))
    .sort((a, b) => a.time - b.time);

let previousTide = null;
let nextTide = null;

for (let i = 0; i < sortedTides.length; i++) {

    if (sortedTides[i].time > now) {
        nextTide = sortedTides[i];
        previousTide = sortedTides[i - 1];
        break;
    }
}

let currentHeight = 0;
let tideStatus = "🌊";

if (previousTide && nextTide) {

    const totalTime =
        nextTide.time - previousTide.time;

    const elapsedTime =
        now - previousTide.time;

    const fraction =
        elapsedTime / totalTime;

   const cosineFraction =
    (1 - Math.cos(Math.PI * fraction)) / 2;

currentHeight =
    Number(previousTide.Height) +
    (
        Number(nextTide.Height)
        - Number(previousTide.Height)
    ) * cosineFraction;

    tideStatus =
    nextTide.EventType === "HighWater"
        ? "⬆ Rising Tide"
        : "⬇ Falling Tide";

}
    
document.getElementById("tides").innerHTML =
        `
        Current: ${currentHeight.toFixed(1)}m<br>
${tideStatus}<br>

Next ${
    upcomingTide.EventType
        .replace("HighWater", "Banna")
        .replace("LowWater", "Low Tide")
}: ${new Date(upcomingTide.DateTime).toLocaleTimeString(
    "en-GB",
    {
        hour: "2-digit",
        minute: "2-digit"
    }
)}
• ${Number(upcomingTide.Height).toFixed(1)}m
<br>

        Highs:
        ${highTides.map(t =>
           new Date(t.DateTime).toLocaleTimeString(
    "en-GB",
    {
        hour: "2-digit",
        minute: "2-digit"
    }
)
        ).join(" • ")}

        <br>

        Lows:
        ${lowTides.map(t =>
            new Date(t.DateTime).toLocaleTimeString(
    "en-GB",
    {
        hour: "2-digit",
        minute: "2-digit"
    }
)
        ).join(" • ")}
        `;
}
loadWeather();
getMoonPhase();
loadTides();
