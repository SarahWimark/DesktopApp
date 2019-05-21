/**
 * Class that handles saving and loading the city to display weather for
 *
 * @export
 * @class Storage
 */
export default class Storage {
  constructor () {
    this.city = null
    this.defaultCity = 'Stockholm'
  }
/**
 * Returns the saved city from localstorage or returns a default city
 * if no city is saved
 *
 * @returns the city to get weather information for
 * @memberof Storage
 */
  getLocationData () {
    if (window.localStorage.getItem('city') === null) {
      this.city = this.defaultCity
    } else {
      this.city = window.localStorage.getItem('city')
    }

    return {
      city: this.city
    }
  }
/**
 * Save city to local storage
 *
 * @param {*} city
 * @memberof Storage
 */
  setLocationData (city) {
    window.localStorage.setItem('city', city)
  }
}
