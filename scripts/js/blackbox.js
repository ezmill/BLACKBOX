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

    var scene, camera, light, renderer, texture, fbMaterial, mask, origTex;
    var effectIndex = 0;
    var id;
    var effects = [ "warp",
                    "color blur",
                    "revert",
                    "rgb shift",
                    "oil paint",
                    "median blur",
                    "repos",
                    "flow",
                    "gradient",
                    "warp flow",
                    "stained glass",
                    "curves",
                    "neon glow"
                ]
    shuffle(effects);
    insertRevert(effects);
    var uploadButton = document.getElementById("BB-upload-button");
    var infoButton = document.getElementById("BB-info-button");
    var exitButton = document.getElementById("BB-exit-button");
    var icons = document.getElementById("BB-icons");
    var instructions = document.getElementById("BB-instructions");
    var finalPage = document.getElementById("BB-finalPage");
    //to-do splice in BASE shader at first index and then remove after starting
    var infoCounter = 0;
    var audio = new Audio();
    audio.src = "assets/audio/Plasma_Lotus.mp3";
    audio.load();
    audio.volume = 0;
    var playing = false;
    origTex = THREE.ImageUtils.loadTexture("assets/textures/test.jpg");
    origTex.minFilter = origTex.magFilter = THREE.LinearFilter;
    init();
    function init(){
        scene = new THREE.Scene();
        camera = new THREE.OrthographicCamera( renderSize.x / - 2, renderSize.x / 2, renderSize.y / 2, renderSize.y / - 2, -10000, 10000 );
        camera.position.set(0,0,0);
        renderer = new THREE.WebGLRenderer({preserveDrawingBuffer:true});
        renderer.setSize( renderSize.x, renderSize.y );
        renderer.setClearColor(0xffffff,1.0);
        createEffect();
        playing = true;
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener( 'touchstart', onDocumentTouchStart, false );
        document.addEventListener( 'touchmove', onDocumentTouchMove, false );
        document.addEventListener( 'touchend', onDocumentTouchEnd, false );
        document.addEventListener( 'touchcancel', onDocumentTouchEnd, false );
        document.addEventListener( 'touchleave', onDocumentTouchEnd, false );
        window.addEventListener("resize", onWindowResize);
        uploadButton.addEventListener("click", upload);
        infoButton.addEventListener("click", exitInfo);
        exitButton.addEventListener("click", exitInfo);
        uploadButton.addEventListener("touchstart", upload);
        uploadButton.addEventListener("touchdown", upload);
        infoButton.addEventListener("touchstart", exitInfo);
        infoButton.addEventListener("touchdown", exitInfo);
        exitButton.addEventListener("touchstart", exitInfo);
        exitButton.addEventListener("touchdown", exitInfo);
        animate();
    }
    function createEffect(){
        if(texture)texture.dispose();
        image = new Image();
        // var blob = dataURItoBlob(base64);
        // var file = window.URL.createObjectURL(blob);
        var img = new Image();
        img.src = base64;
        // console.log(img);
        // image.src = base64;
        texture = new THREE.Texture();
        texture.image = img;
        texture.minFilter = texture.magFilter = THREE.LinearFilter;
        effect = new Effect(effects[effectIndex]);
        effect.init();
        if(effect.useMask){
            mask = new Mask();
            mask.init();
            mask.update();
            alpha = new THREE.Texture(mask.renderer.domElement);
            alpha.minFilter = alpha.magFilter = THREE.LinearFilter;
            alpha.needsUpdate = true;
        } else {
            alpha = null;
        }
        if(fbMaterial)fbMaterial.dispose();
        fbMaterial = new FeedbackMaterial(renderer, scene, camera, texture, origTex, effect.shaders);  
        fbMaterial.init();
        fbMaterial.setUniforms();
        img.onload = function(){
            texture.needsUpdate = true;
            // texture = THREE.ImageUtils.loadTexture("assets/images/image.jpg");
        }
    }   
    function createNewEffect(){
        if(effectIndex == effects.length - 1){
            effectIndex = 0;
        } else {
            effectIndex++;
        }       
        var blob = dataURItoBlob(renderer.domElement.toDataURL('image/jpg'));
        var file = window.URL.createObjectURL(blob);
        var img = new Image();
        img.src = file;
        img.onload = function(e) {
            texture.dispose();
            texture.image = img;            
            effect = new Effect(effects[effectIndex]);
            effect.init();
            if(effect.useMask){
                mask = new Mask();
                mask.init();
                mask.update();
                alpha = new THREE.Texture(mask.renderer.domElement);
                alpha.minFilter = alpha.magFilter = THREE.LinearFilter;
                alpha.needsUpdate = true;
            } else {
                alpha = null;
            }
            fbMaterial.dispose();
            fbMaterial = new FeedbackMaterial(renderer, scene, camera, texture, origTex, effect.shaders);            
            fbMaterial.init();
            fbMaterial.setUniforms();

        }
    }
    function animate(){
        id = requestAnimationFrame(animate);
        draw();
    }
    function draw(){
        time += 0.01;
        if(mouseDown){
            r2 = 0.5;
        }
        if(effect.useMask){
            mask.update();
            alpha.needsUpdate = true;
        }
        if(playing){
            audio.play();
            audio.volume += (1.0 - audio.volume)*0.01;
        } else {
            audio.volume += (0.0 - audio.volume)*0.01;
            finalPage.className = "BB-visible";
        }
        fbMaterial.setUniforms();
        fbMaterial.update();
        renderer.render(scene, camera);
        fbMaterial.getNewFrame();
        fbMaterial.swapBuffers();
    }
    div.appendChild(renderer.domElement)

    // Put a "Save" button the the wrapper.
    var button = document.getElementById('BB-upload-button')
    // button.type = 'button'
    // button.innerHTML = 'Save'
    button.addEventListener('click', onClickButton)
    // div.appendChild(button)

    // Attach the wrapper and its content to the root element.
    el.appendChild(div)

    // Render the input image data to the canvas.
    var image = new Image()
    image.src = renderer.domElement.toDataURL('image/jpeg');
    // el.appendChild(image);
    // This function is called on the "Save" button click.
    function onClickButton () {
        // Remove the button's event listener.
        button.removeEventListener('click', onClickButton)

        // Detach the UI wrapper and its content from the root element.
        el.removeChild(div)

        // Call the callback function, passing the new canvas content to it.
        var base64 = renderer.domElement.toDataURL('image/jpeg');

        cancelAnimationFrame(id);// Stop the animation
        scene = null;
        camera = null;
        cb(null, base64)
    }
    function dataURItoBlob(dataURI) {
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {
            type: mimeString
        });
    }
    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex ;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    }
    function insertRevert(array){
        var length = array.length;
        for(var i = 0; i < length; i++){
            if(array[i] == "revert"){
                array.splice(i, 1);
            }
        }
        for(var i = 0; i < length; i++){
            if(array[i] == "flow" || array[i] == "repos"){
                array.splice(i+1, 0, "revert");
            }
        }
    }
    function onKeyDown(e){
        if(e.keyCode == '88'){
            // mask.switchColor();
            createNewEffect();
        }
        if(e.keyCode == '32'){
            e.preventDefault();
        }
    }
    function onMouseMove(event){
        mouse.x = ( event.pageX / renderSize.x ) * 2 - 1;
        mouse.y = - ( event.pageY / renderSize.y ) * 2 + 1;
        if(effect.useMask){
            mask.mouse = new THREE.Vector2(mouse.x, mouse.y);       
        }
    }
    function onMouseDown(){
        mouseDown = true;
    }
    function onMouseUp(){
        mouseDown = false;
        r2 = 0;
        createNewEffect();
    }
    function onDocumentTouchStart( event ) {
        mouseDown = true;
        updateMouse(event);
    }

    function onDocumentTouchMove( event ) {
        mouseDown = true;
        updateMouse(event);
    }

    function updateMouse(event){
        if ( event.touches.length === 1 ) {
            event.preventDefault();
            if(effect.useMask){
                mask.mouse = new THREE.Vector2(event.touches[ 0 ].pageX, event.touches[ 0 ].pageY);     
            }
            mouse.x = ( event.touches[ 0 ].pageX / renderSize.x ) * 2 - 1;
            mouse.y = - ( event.touches[ 0 ].pageY / renderSize.y ) * 2 + 1;
        }
    }
        
    function onDocumentTouchEnd( event ) {
        mouseDown = false;
        r2 = 0;
        createNewEffect();
    }
    function onWindowResize( event ) {
        // renderSize = new THREE.Vector2(window.innerWidth, 2500*(window.innerWidth/3750));
        // renderSize = new THREE.Vector2(3750*(window.innerHeight/2500), window.innerHeight);
        if(window.innerWidth>3750*(window.innerHeight/2500)){
            renderSize = new THREE.Vector2(window.innerWidth, 2500*(window.innerWidth/3750));
        } else {
            renderSize = new THREE.Vector2(3750*(window.innerHeight/2500), window.innerHeight);
        }
        // renderSize = new THREE.Vector2(window.innerWidth, window.innerHeight);
        renderer.setSize( renderSize.x, renderSize.y );
        camera.left = renderSize.x / - 2;
        camera.right = renderSize.x / 2;
        camera.top = renderSize.x / 2;
        camera.bottom = renderSize.x / - 2;
        if(effect.useMask)mask.resize();
        fbMaterial.setUniforms();
        fbMaterial.resize();
        renderer.render(scene, camera);
        fbMaterial.getNewFrame();
        fbMaterial.swapBuffers();

    }
    function exitInfo(){
        if(infoCounter%2 == 0){
            icons.className = "BB-hidden";
            instructions.className = "BB-visible";
        } else {
            icons.className = "BB-visible";
            instructions.className = "BB-hidden";
        }
        infoCounter++;
    }
    function upload(){
        playing = false;
    }
}

return blackbox

})
