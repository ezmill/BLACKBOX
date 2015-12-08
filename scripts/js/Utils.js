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
    console.log(e);
    if(e.keyCode == '88'){
        // mask.switchColor();
        createNewEffect();
    }
    if(e.keyCode == '32'){
        e.preventDefault();
        var blob = dataURItoBlob(renderer.domElement.toDataURL('image/jpg'));
        var file = window.URL.createObjectURL(blob);
        var img = new Image();
        img.src = file;
        img.onload = function(e) {
            window.open(this.src);
        }
    }
}

function onMouseMove(event){
    mouse.x = ( event.pageX / renderSize.x ) * 2 - 1;
    mouse.y = - ( event.pageY / renderSize.y ) * 2 + 1;
    // if(effect.useMask){
        // mask.mouse = new THREE.Vector2(event.pageX, event.pageY);        
        mask.mouse = new THREE.Vector2(mouse.x, mouse.y);       
    // }
}
function onMouseDown(){
    mouseDown = true;
    for(var i = 0; i < fbMaterial.fbos.length; i++){
        // if(fbMaterial.fbos[i].material.uniforms["id"])fbMaterial.fbos[i].material.uniforms["id"].value = Math.floor(Math.random()*25);
        // if(fbMaterial.fbos[i].material.uniforms["id2"])fbMaterial.fbos[i].material.uniforms["id2"].value = Math.floor(Math.random()*25);
    }
}
function onMouseUp(){
    mouseDown = false;
    r2 = 0;
    // setTimeout(createNewEffect, 1000);
    createNewEffect();
}