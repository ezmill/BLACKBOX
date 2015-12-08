;(function (root, document, factory) {
    root.blackbox = factory()
})(this, this.document, function () {

/**
 * @param {DOMNode} el Root element of the blackbox.
 * @param {string} base64 Input image data (baes64-encoded string).
 * @param {function} cb Callback function.
 */
function blackbox (el, base64, cb) {
    // Create the Blackbox's UI elements wrapper.
    var div = document.createElement('div')
    div.className = 'blackbox'

    // Put a canvas to the wrapper.
    var canvas = document.createElement('canvas')
    canvas.width = 640
    canvas.height = 480
    div.appendChild(canvas)

    // Put a "Save" button the the wrapper.
    var button = document.createElement('button')
    button.type = 'button'
    button.innerHTML = 'Save'
    button.addEventListener('click', onClickButton)
    div.appendChild(button)

    // Attach the wrapper and its content to the root element.
    el.appendChild(div)

    // Render the input image data to the canvas.
    var ctx = canvas.getContext('2d')
    var image = new Image()
    image.src = base64
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

    // Apply some random filters after a short delay.
    // This should be replaced with the actual filters code.
    setTimeout(function () {
        var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
        var d = pixels.data
        var k = Math.random()
        for (var i = 0; i < d.length; i += 4) {
            d[i] = 0.32 * k * d[i] + 0.5 * k * d[i + 1] + 0.16 * k * d[i + 2]
        }
        ctx.putImageData(pixels, 0, 0)
    }, 1000)

    // This function is called on the "Save" button click.
    function onClickButton () {
        // Remove the button's event listener.
        button.removeEventListener('click', onClickButton)

        // Detach the UI wrapper and its content from the root element.
        el.removeChild(div)

        // Call the callback function, passing the new canvas content to it.
        var base64 = canvas.toDataURL()
        cb(null, base64)
    }
}

return blackbox

})
