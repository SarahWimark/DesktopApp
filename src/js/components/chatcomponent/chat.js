import * as config from './config.js'
/**
 * Custom webcomponent for a chatapplication
 *
 * @class Chat
 * @extends {window.HTMLElement}
 */
class Chat extends window.HTMLElement {
  constructor () {
    super()
    this.name = ''
    this.message = ''
    this.button = ''
    this.username = ''
    this.usernameBtn = ''
    this.socket = null
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* html */ `
    <style>
       #simple-chat{
    width: 400px;
    margin-top: 40px;
    margin-bottom: 20px;
}

.chatContainer{
    height: 350px;
    overflow: auto;
    background: #f9f9f9;
    overflow-wrap: break-word;
    padding: 5px;
    font-family: "Comic Sans MS", cursive, sans-serif;
    font-size: 14px;
}

.sidemenu {
  width: 350px;
  height: 450px;
  background: rgb(201, 199, 199);
  padding: 10px;
  text-align: center;
  position: absolute;
  margin: 0;
  color: black;
  opacity: 0;
  transition: opacity 2s ease-in;
}

#output p{
    padding: 14px 0px;
    margin: 0 20px;
    border-bottom: 1px solid #e9e9e9;
    color: #555;
}

#feedback p{
    color: #aaa;
    padding: 14px 0px;
    margin: 0 20px;
}

#output strong{
    color: #575ed8;
}

#userOutput strong{
    color:rgb(17, 1, 165);
}

#timeStamp{
    float: right;
    color: #555;
    font-size: small;
}

label{
    box-sizing: border-box;
    display: block;
    padding: 10px 20px;
}

#message{
    padding: 10px 20px;
    box-sizing: border-box;
    background: #eee;
    border: 0;
    border-top: 1px solid black;
    display: block;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #eee;
    font-size: 16px;
}

#send {
    background: rgb(223, 182, 4);
    font-size: 24px;
    padding: 12px 0;
    border: 1px solid rgb(223, 182, 4);
    width: 100%;
    border-radius: 0 0 2px 2px;
    height: 60px;
}

#send:hover {
    background: rgb(255, 255, 0);
}

#userOutput {
    text-align: center;
    padding: 5px;
    font-size: 16px;
    font-style: bold;
    background: aliceblue;
}

#userName {
    padding: 10px ;
    background: #eee;
    border: 0;
    width: 64%;
    background: #fff;
    border-bottom: 1px solid #eee;
    font-size: 16px;
}


#changeName {
    background: rgb(0, 0, 0, 0.8);
    color: #fff;
    font-size: 12px;
    padding: 12px 0;
    width: 30%;
    border-radius: 0 0 2px 2px;
    float: right;
    border: 1px solid rgb(0, 0, 0, 0.8);
}

#changeName:hover {
  font-size: 14px;
}

input[disabled] {pointer-events: visible}
    </style>
    <template id="chatTemplate">
    <div id="simple-chat">
    <div class="chatContainer">
    <input id="userName" type="text" placeholder="Write your username">
    <button id="changeName">Enter username</button>
        <div id="output"></div>
        <div id="feedback"></div>
        <div id="timeStamp"></div>
    </div>
    <textarea id="message" rows="3" cols="10" placeholder="Enter message" autofocus></textarea>
    <button id="send">Send message</button>
</div>
</template>
   `
    const template = this.shadowRoot.querySelector('#chatTemplate')
    const instance = template.content.cloneNode(true)
    this.shadowRoot.appendChild(instance)
  }
/**
 * Method that runs when the chat component gets added to the DOM
 *
 * @memberof Chat
 */
  connectedCallback () {
    this.message = this.shadowRoot.querySelector('#message')
    this.button = this.shadowRoot.querySelector('#send')
    this.username = this.shadowRoot.querySelector('#userName')
    this.usernameBtn = this.shadowRoot.querySelector('#changeName')

    if (this._getName() === null) {
      this._toggleDisabled(true)
      this.username.focus()
    } else {
      this.name = this._getName()
    }

    this._connect()

    this.usernameBtn.addEventListener('click', () => {
      this.name = this.username.value
      if (this.name !== undefined) {
        this._setName(this.name)
        this._toggleDisabled(false)
      }
    })

    this.button.addEventListener('click', () => {
      this._sendMessage(this.message.value)
    })

    this.message.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this._sendMessage(e.target.value)
      }
    })
  }
/**
 * Method that runs when the chat component gets removed from the DOM
 * Closes the websocket connections
 * @memberof Chat
 */
  disconnectedCallback () {
    this.socket.close()
  }
/**
 * Save the users name in local storage and set the chats
 * active name to the added name
 *
 * @memberof Chat
 */
  _setName () {
    window.localStorage.setItem('name', this.name)
    this.name = this._getName()
  }
/**
 * Return the username that is saved in local storage
 *
 * @returns
 * @memberof Chat
 */
  _getName () {
    let name = window.localStorage.getItem('name')
    return name
  }
/**
 * Set the disabled state of the elements to true or false
 *
 * @param {*} state - true or false state
 * @memberof Chat
 */
  _toggleDisabled (state) {
    this.message.disabled = state
    this.button.disabled = state
  }
/**
 * Make a socket and listen to if messages are added to the chat
 *
 * @memberof Chat
 */
  _connect () {
    this.socket = new window.WebSocket(config.address)

    this.socket.onmessage = (event) => {
      let message = JSON.parse(event.data)
      if (message.type === 'message') {
        this._printMessage(message.username, message.data)
      }
    }
  }
/**
 * Send a message
 *
 * @param {*} text - the text to be sent
 * @memberof Chat
 */
  _sendMessage (text) {
    let data = {
      type: 'message',
      data: text,
      username: this.name,
      channel: '',
      key: config.key
    }
    this.socket.send(JSON.stringify(data))
  }
/**
 * Print the incoming messages in the chat with username, the message and a timestamp
 *
 * @param {*} handle - the username of the user that sent the message
 * @param {*} text - the message to be added to the chat
 * @memberof Chat
 */
  _printMessage (handle, text) {
    const output = this.shadowRoot.querySelector('#output')
    const chatWindow = this.shadowRoot.querySelector('.chatContainer')
    const message = this.shadowRoot.querySelector('#message')
    let date = new Date()
    let month = date.toLocaleString('sv', {
      month: 'short'
    })
    let time = `${date.getDate()} ${month} ${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`

    output.innerHTML += `<p><strong>${handle}</strong><span id="timeStamp">${time}</span><br><br>${text}</p>`
    message.value = ''
    message.focus()
    message.scrollTop = message.scrollHeight
    let scrollHeight = chatWindow.scrollHeight
    chatWindow.scrollTo(0, scrollHeight)
  }
}
window.customElements.define('chat-component', Chat)
