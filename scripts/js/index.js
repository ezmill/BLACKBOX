;(function (root, blackbox) {

var buttonEl = document.getElementById('button')
var imgEl = document.getElementById('img')
var blackboxEl = document.getElementById('blackbox')
var dialogEl = document.getElementById('dialog')
var ulEl = document.getElementById('ul')

buttonEl.addEventListener('click', onClickButton)

function onClickButton () {
    var canvas = document.createElement('canvas')
    canvas.width = imgEl.width
    canvas.height = imgEl.height
    var ctx = canvas.getContext('2d')
    ctx.drawImage(imgEl, 0, 0)
    var base64 = canvas.toDataURL()
    dialogEl.style.display = 'block'
    blackbox(blackboxEl, base64, onCompleteBlackbox)
    disable()
}

function onCompleteBlackbox (err, base64) {
    if (err) { console.error(err); return }
    dialogEl.style.display = 'none'
    var liEl = document.createElement('li')
    var imgEl = new Image()
    imgEl.height = 128
    imgEl.src = base64
    liEl.appendChild(imgEl)
    ulEl.appendChild(liEl)
    enable()
}

function disable () {
    buttonEl.disabled = true
    buttonEl.removeEventListener('click', onClickButton)
}

function enable () {
    buttonEl.disabled = false
    buttonEl.addEventListener('click', onClickButton)
}

})(this, this.blackbox)
