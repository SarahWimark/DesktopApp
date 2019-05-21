const template = document.createElement('template')
template.innerHTML = /* html */ `
   <div tabindex="0" class="base-container">
    <div class="header">
        <img id="windowIcon" src="">
        <button class="closeBtn">X</button>
    </div>
    <slot name="component"></slot>
    <div class="footer"></div>
</div>
`
/**
 * Class to create a draggable window
 *
 * @export
 * @class Window
 */
export default class Window {
  constructor (windowId, positionCounter) {
    this.container = ''
    this.header = ''
    this.closeBtn = ''
    this.windowId = windowId
    this.positionCounter = positionCounter
    this.newLeftPos = 0
    this.newTopPos = 0
    this.isMouseDown = false
  }

  /**
   * Creates the window and sets up eventlisteners to
   * be able to close and drag the window
   *
   * @memberof Window
   */
  createWindow () {
    let clone = document.importNode(template.content, true)
    document.body.appendChild(clone)
    this.container = document.querySelectorAll('.base-container')[this.windowId]
    this.header = document.querySelectorAll('.header')[this.windowId]
    this.closeBtn = document.querySelectorAll('.closeBtn')[this.windowId]
    this._updatePosition(this.positionCounter)

    this.closeBtn.addEventListener('click', (e) => {
      document.body.removeChild(this.container)
    })

    this.container.addEventListener('mousedown', (e) => {
      this.container.focus()
      this._onMouseDown(e)
    })

    document.body.addEventListener('mousemove', (e) => {
      this._onMouseMove(e)
    })

    document.body.addEventListener('mouseup', (e) => {
      this._onMouseUp()
    })

    this.container.focus()
  }

  /**
   * Used by eventlistener when the mouse is clicked on a window to move
   *
   * @param {*} e - information about the event
   * @memberof Window
   */
  _onMouseDown (e) {
    this.isMouseDown = true
    this.mouseOffset = {
      x: this.container.offsetLeft - e.clientX,
      y: this.container.offsetTop - e.clientY
    }
  }
/**
 * Used by eventlistener when the mouse is released from the
 * window currently being moved
 *
 * @memberof Window
 */
  _onMouseUp () {
    this.isMouseDown = false
  }

   /**
   * Used by eventlistener when the window are being moved
   *
   * @param {*} e - information about the event
   * @memberof Window
   */
  _onMouseMove (e) {
    e.preventDefault()
    if (this.isMouseDown) {
      this.container.style.left = `${e.clientX + this.mouseOffset.x}px`
      this.container.style.top = `${e.clientY + this.mouseOffset.y}px`
    }
  }
/**
 * Update the windows position for windows to be visible behind eachother
 * when stacked
 *
 * @param {*} positionCounter - to keep track of the amount to update with
 * @memberof Window
 */
  _updatePosition (positionCounter) {
    this.newLeftPos = window.pageXOffset + this.container.getBoundingClientRect().left + positionCounter
    this.newTopPos = window.pageYOffset + this.container.getBoundingClientRect().top + positionCounter
    this.container.style.left = `${this.newLeftPos}px`
    this.container.style.top = `${this.newTopPos}px`
  }
}
