import Storage from './storage.js'
import UI from './ui.js'

// Init Storage
const storage = new Storage()

// Get stored locationdata
const weatherLocation = storage.getLocationData()

// Init UI
const ui = new UI()
/**
 * Custom webcomponent for a weatherapplication
 *
 * @class Weather
 * @extends {window.HTMLElement}
 */
class Weather extends window.HTMLElement {
  constructor () {
    super()
    this.apiKey = '9624606b061089d5fc165782aabd152f'
    this.city = weatherLocation.city
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* html */ `
    <style>
.weatherContainer {
    width:400px;
    height:450px;
    padding:20px;
    margin-top: 30px;
    text-align: center;
    background: lightblue;
    font-family: Oxygen, sans-serif;
}

li {
    width:200px;
    height:50px;
    border-radius: 5px;
    background: #fff;
    padding: 10px;
    margin: 0 auto;
    margin-bottom: 5px;
    list-style: none;
    color: #000;
    font-size: 12px;
}

</style>
<template id="weatherTemplate">
<link rel="stylesheet" href="https://bootswatch.com/4/cerulean/bootstrap.min.css">
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49"
crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js" integrity="sha384-smHYKdLADwkXOn1EmN1qk/HfnUcbVRZyYmZ4qpPea6sjB/pTJ0euyQp0Mk8ck+5T"
crossorigin="anonymous"></script>
<div class="weatherContainer bg-primary">
    <div class="">
        <h1 id="w-location"></h1>
        <h3 class="text-dark" id="w-desc"></h3>
        <h3 id="w-string"></h3>
        <img id="w-icon">
        <ul id="w-details" class="list-group">
            <li class="" id="w-wind"></li>
            <li class="" id="w-humidity"></li>
        </ul>
        <hr>
        <!-- Button trigger modal -->
        <button id="w-change-btn" type="button" class="btn btn-dark" data-toggle="modal" data-target="#locModal">
                Change location
            </button>
    </div>
</div>
  `
    const template = this.shadowRoot.querySelector('#weatherTemplate')
    const instance = template.content.cloneNode(true)
    this.shadowRoot.appendChild(instance)
  }
/**
 * Called when the component is added to the DOM
 *
 * @memberof Weather
 */
  connectedCallback () {
    this.getWeatherData()

    // Change location event
    this.shadowRoot.getElementById('w-change-btn').addEventListener('click', (e) => {
      const city = window.prompt('Enter new city', '')
      this.changeLocation(city)

      // Set location in local storage
      storage.setLocationData(city)
      this.getWeatherData()
    })
  }
/**
 * Get and display the weather data
 *
 * @memberof Weather
 */
  getWeatherData () {
    this.getWeather()
            .then(results => {
              ui.paint(results, this.shadowRoot)
            })
            .catch(err => console.log(err))
  }
/**
 * Change what city to display weather data for
 *
 * @param {*} city
 * @memberof Weather
 */
  changeLocation (city) {
    this.city = city
  }
/**
 * Fetches the weather data from the api
 *
 * @returns the weather data for the provided city
 * @memberof Weather
 */
  async getWeather () {
    const response = await window.fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.city}&APPID=${this.apiKey}`)

    const responseData = await response.json()

    return responseData
  }
}
window.customElements.define('weather-component', Weather)
