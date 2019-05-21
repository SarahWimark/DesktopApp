import Window from './window.js'

/**
 * Class used to handle the custom webcomponents
 *
 * @class WindowsController
 */
class WindowsController {
  constructor () {
    this.memoryIcon = document.querySelector('#memoryIcon')
    this.weatherIcon = document.querySelector('#weatherIcon')
    this.chatIcon = document.querySelector('#chatIcon')
    this.closeIcon = document.querySelector('#closeIcon')
    this.windowCounter = 0
    this.positionCounter = 0
    this.zIndex = 1
  }

  /**
   * Add eventlisteners to all the icons on the desktop menu
   *
   * @memberof ComponentsController
   */
  addListeners () {
    this.memoryIcon.addEventListener('click', () => {
      let component = 'memory-component'
      let iconImage = './img/memoryIcon.png'
      this._createApp(component, iconImage)
    })

    this.weatherIcon.addEventListener('click', () => {
      let component = 'weather-component'
      let iconImage = './img/weatherIcon.png'
      this._createApp(component, iconImage)
    })

    this.chatIcon.addEventListener('click', () => {
      let component = 'chat-component'
      let iconImage = './img/chatIcon.png'
      this._createApp(component, iconImage)
    })

    this.closeIcon.addEventListener('click', () => {
      this._closeAllWindows()
      this.zIndex = 0
    })
  }

  /**
   * Updates the counter to keep track of opened and closed windows
   *
   * @memberof ComponentsController
   */
  _updateWindowCounter () {
    const baseContainers = document.querySelectorAll('.base-container')
    this.windowCounter = baseContainers.length
  }
/**
 * Update the pisitioncounter to keep track of what position created windows
 * should get
 *
 * @memberof ComponentsController
 */
  _updatePositionCounter () {
    if (this.positionCounter < 250) {
      this.windowCounter === 0 ? this.positionCounter = 0
      : this.positionCounter += 15
    } else {
      this.positionCounter = 15
    }
  }

  /**
   * Creates an app by adding a webcomponent to a window
   *
   * @param {*} component - the type of component to add
   * @param {*} iconImage - the apps icon image
   * @memberof ComponentsController
   */
  _createApp (component, iconImage) {
    this._updateWindowCounter()
    this._updatePositionCounter()
    const window = new Window(this.windowCounter, this.positionCounter)
    window.createWindow()
    const baseContainer = document.querySelectorAll('.base-container')[this.windowCounter]
    const appContainer = document.createElement(component)
    baseContainer.appendChild(appContainer)
    document.querySelectorAll('#windowIcon')[this.windowCounter].src = iconImage
    this._setZIndex(baseContainer)
  }

  /**
   *  Set a new z-index on a clicked container to display it on top of other opened
   * windows
   *
   * @param {*} container - the container to set z-index on
   * @memberof ComponentsController
   */
  _setZIndex (container) {
    if (this.windowCounter === 0) {
      this.zIndex = 1
    }
    container.addEventListener('click', (e) => {
      container.style.zIndex = this.zIndex++
    })
  }

  /**
   * Close all open windows by removing them from the DOM
   *
   * @memberof ComponentsController
   */
  _closeAllWindows () {
    let containerList = document.querySelectorAll('.base-container')

    containerList.forEach(element => {
      document.body.removeChild(element)
    })
  }
}
export default WindowsController
