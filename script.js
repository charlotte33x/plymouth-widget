function getMoonPhase() {
    const today = new Date();

    const knownNewMoon = new Date("2024-01-11");
    const lunarCycle = 29.53;

    const daysSince =
        (today - knownNewMoon) / (1000 * 60 * 60 * 24);

    const phase = daysSince % lunarCycle;

    let phaseName = "";

    if (phase < 1) {
        phaseName = "🌑 New Moon";
    } else if (phase < 7) {
        phaseName = "🌒 Waxing Crescent";
    } else if (phase < 15) {
        phaseName = "🌔 Waxing Gibbous";
    } else if (phase < 16) {
        phaseName = "🌕 Full Moon";
    } else if (phase < 22) {
        phaseName = "🌖 Waning Gibbous";
    } else {
        phaseName = "🌘 Waning Crescent";
    }

    document.getElementById("moon").innerHTML = phaseName;
}

async function loadWeather() {

    const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=50.3755&longitude=-4.1427&current=temperature_2m&daily=temperature_2m_max,temperature_2m_min&forecast_days=3"
    );

    const data = await response.json();

    document.getElementById("temperature").innerHTML =
        `Air: ${data.current.temperature_2m}°C`;

    const days = data.daily.time;

    document.getElementById("forecast").innerHTML =
        `
        <b>${new Date(days[0]).toLocaleDateString('en-GB', { weekday: 'short' })}</b> ${Math.round(data.daily.temperature_2m_max[0])}°
        &nbsp;|&nbsp;
        <b>${new Date(days[1]).toLocaleDateString('en-GB', { weekday: 'short' })}</b> ${Math.round(data.daily.temperature_2m_max[1])}°
        &nbsp;|&nbsp;
        <b>${new Date(days[2]).toLocaleDateString('en-GB', { weekday: 'short' })}</b> ${Math.round(data.daily.temperature_2m_max[2])}°
        `;
}

loadWeather();
document.getElementById("moon").innerHTML = "🌕 Moon Works!";
