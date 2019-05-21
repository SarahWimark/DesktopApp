/**
 * Class to add the weatherapp UI to the weatherapp component
 *
 * @export
 * @class Window
 */
export default class UI {
  paint (weather, shadowRoot) {
    const location = shadowRoot.getElementById('w-location')
    const string = shadowRoot.getElementById('w-string')
    const desc = shadowRoot.getElementById('w-desc')
    const icon = shadowRoot.getElementById('w-icon')
    const humidity = shadowRoot.getElementById('w-humidity')
    const wind = shadowRoot.getElementById('w-wind')

    location.textContent = weather.name + ', ' + weather.sys.country
    desc.textContent = weather.weather[0].main
    string.textContent = Math.round(weather.main.temp - 273.15) + ' \u00b0C'
    icon.setAttribute('src', `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`)
    humidity.textContent = `Relative Humidity: ${weather.main.humidity} %`
    wind.textContent = `Wind speed: ${weather.wind.speed} MPH`
  }
}
