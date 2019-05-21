/**
 * Custom webcomponent for a memorygame
 *
 * @class Memory
 * @extends {window.HTMLElement}
 */
class Memory extends window.HTMLElement {
  constructor () {
    super()
    this.turns = 0
    this.pair = 0
    this.tries = 0
    this.flippedTiles = []
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* html */ `
      <style>
 .memoryContainer {
    width: 400px;
    height: auto;
    margin: 0px auto;
    padding: 50px;
    text-align: center;
    text-shadow: 2px 2px 5px rgb(255, 255, 255);
    font-family: "Comic Sans MS", cursive, sans-serif;
    text-align: center;
}

.memoryContainer img {
    height: 50px;
    width: 50px;
    margin: 5px;
    border: 1px solid #000;
    box-shadow: 5px 5px 4px rgba(0, 0, 0, .5);
}

.memoryContainer a {
    text-decoration: none;
}

.memoryContainer p {
    color: black;
}

h1 {
    box-shadow: 5px 5px 4px rgba(0, 0, 0, .5);
    background-color: white;
    opacity: 0.7;
    color: #000;
    font-size: 20px;
    padding: 5px;
    border: 1px solid #000;
}

.removed {
    visibility: hidden;
}

a {
 text-decoration: none;
}

a:hover {text-decoration: none;}
</style>
<template id="memoryTemplate">
  <div class="memoryContainer">
  <p></p>
   <h1 id="output">Memory Game</h1>
    <template id="template">
        <a href="#">
            <img src="/img/0.jpg" alt="Memory brick">
        </a>
    </template>
  </div>
</template>
    `
    const template = this.shadowRoot.querySelector('#memoryTemplate')
    const instance = template.content.cloneNode(true)
    this.shadowRoot.appendChild(instance)
  }
  /**
   * Method that runs when the component is added.
   * Starts the memorygame
   *
   * @memberof Memory
   */
  connectedCallback () {
    this._createBoard(4, 4)
  }
/**
 * Sets up the memoryboard with memorybricks
 *
 * @param {*} rows- how many rows to add
 * @param {*} cols - how many columns to add
 * @memberof Memory
 */
  _createBoard (rows, cols) {
    const board = this.shadowRoot.querySelector('.memoryContainer')
    const template = this.shadowRoot.querySelectorAll('.memoryContainer template')[0].content.firstElementChild
    let tiles = this._getPictureArray(rows, cols)
    let aTag
    this._shuffleArray(tiles)
    let _this = this
    this.shadowRoot.querySelector('#output').textContent = 'Memory Game'
    this._getHighscore()

    tiles.forEach(function (tile, index) {
      aTag = document.importNode(template, true)
      board.appendChild(aTag)

      aTag.addEventListener('click', (event) => {
        let img = event.target.nodeName === 'IMG' ? event.target : event.target.firstElementChild
        _this._turnBrick(tile, img, cols, rows)
      })

      if ((index + 1) % cols === 0) {
        board.appendChild(document.createElement('br'))
      }
    })
  }
/**
 * Turn the bricks and check the results
 *
 * @param {*} tile
 * @param {*} img
 * @param {*} cols
 * @param {*} rows
 * @memberof Memory
 */
  _turnBrick (tile, img, cols, rows) {
    const output = this.shadowRoot.querySelector('#output')
    img.src = `img/${tile}.jpg`
    this.tries++
    if (this.turns === 0) {
      this.flippedTiles[0] = img
      this.turns = 1
    } else if (this.turns === 1) {
      if (img === this.flippedTiles[0]) { return }
      this.flippedTiles[1] = img
      if (this.flippedTiles[0].src === this.flippedTiles[1].src) {
        this._removeBricks(this.flippedTiles[0], this.flippedTiles[1])
        if (this.pair === (cols * rows) / 2) {
          output.style.fontSize = '12px'
          let tries = Math.floor(this.tries / 2)
          output.innerHTML = 'Well played! You cleared the game in ' + tries + ' tries'
          this._saveHighscore(tries)
          this.tries = 0
          this.pair = 0
        }
        this.flippedTiles = []
      } else {
        this._turnBackBrick(this.flippedTiles[0], this.flippedTiles[1])
      }
      this.turns = 0
    }
  }
/**
 * Save the highest score
 *
 * @param {*} tries
 * @memberof Memory
 */
  _saveHighscore (tries) {
    if (tries < window.localStorage.getItem('highscore')) {
      window.localStorage.setItem('highscore', tries)
    }
  }
/**
 * Display the highest score
 *
 * @memberof Memory
 */
  _getHighscore () {
    if (window.localStorage.getItem('highscore') === null) {
      this.shadowRoot.querySelector('p').innerHTML = `Score to beat: ${0}`
    } else {
      this.shadowRoot.querySelector('p').textContent = `Score to beat: ${window.localStorage.getItem('highscore')}`
    }
  }
/**
 * Turn back the flipped tiles if no match
 *
 * @param {*} brick1
 * @param {*} brick2
 * @memberof Memory
 */
  _turnBackBrick (brick1, brick2) {
    setTimeout(function () {
      brick1.src = '/img/0.jpg'
      brick2.src = '/img/0.jpg'
    }, 500)
  }
/**
 * Remove the bricks that matches
 *
 * @param {*} brick1
 * @param {*} brick2
 * @memberof Memory
 */
  _removeBricks (brick1, brick2) {
    this.pair++
    setTimeout(function () {
      brick1.parentNode.classList.add('removed')
      brick2.parentNode.classList.add('removed')
    }, 500)
  }
/**
 * Create the array of images used in the game
 *
 * @param {*} rows
 * @param {*} cols
 * @returns
 * @memberof Memory
 */
  _getPictureArray (rows, cols) {
    let arr = []

    for (let i = 1; i <= rows * cols / 2; i++) {
      arr.push(i)
      arr.push(i)
    }
    return arr
  }
/**
 * Shuffle the array sent in as an argument
 *
 * @param {*} array
 * @returns
 * @memberof Memory
 */
  _shuffleArray (array) {
    let m = array.length
    let t
    let i

    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--)

      // And swap it with the current element.
      t = array[m]
      array[m] = array[i]
      array[i] = t
    }

    return array
  }
  }
window.customElements.define('memory-component', Memory)
