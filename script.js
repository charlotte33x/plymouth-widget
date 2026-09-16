async function loadWeather() {

    const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=50.3755&longitude=-4.1427&current=temperature_2m&daily=temperature_2m_max&forecast_days=3"
    );

    const data = await response.json();

    document.getElementById("temperature").innerHTML =
        `Air: ${data.current.temperature_2m}°C`;

    document.getElementById("forecast").innerHTML =
        `${data.daily.temperature_2m_max[0]}° |
         ${data.daily.temperature_2m_max[1]}° |
         ${data.daily.temperature_2m_max[2]}°`;
}

loadWeather();
