var drawing = false;
var context;
const mouse = {
    x: 0, y: 0,                        // coordinates
    lastX: 0, lastY: 0,                // last frames mouse position 
    b1: false, b2: false, b3: false,   // buttons
    buttonNames: ["b1", "b2", "b3"],   // named buttons
}

window.onload = function () {
    //Clear Button
    document.getElementById('btnClear').addEventListener('click', function () {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }, false);

    //Width Scale
    document.getElementById('lineWidth').addEventListener('change', function () {
        context.lineWidth = document.getElementById('lineWidth').value;
    }, false);

    //Color
    document.getElementById('colorChange').addEventListener('change', function () {
        context.strokeStyle = document.getElementById('colorChange').value;
    }, false);

    //Save
    /*
    document.getElementById('btnSave').addEventListener('click', function () {
        document.getElementById('myCanvas').style.display = "none";
        document.getElementById('saveArea').style.display = "block";
        document.getElementById('tools').style.display = "none";

        var dataURL = document.getElementById('myCanvas').toDataURL();
        document.getElementById('canvasImg').src = dataURL;
    }, false);
    */

    //Size Canvas
    context = document.getElementById('myCanvas').getContext("2d");
    context.canvas.width = 224;
    context.canvas.height = 224;
    var rect = context.canvas.getBoundingClientRect();
    console.log(rect.left);
    console.log(rect.top);

    //Mouse movement
    document.addEventListener("mousemove", mouseEvent);
    document.addEventListener("mousedown", mouseEvent);
    document.addEventListener("mouseup", mouseEvent);
    //Style line
    context.strokeStyle = "#000";
    context.lineJoin = "round";
    context.lineWidth = 5;

    //Hide Save Area
    //document.getElementById('saveArea').style.display = "none";
}


function mouseEvent(event) {
    var rect = context.canvas.getBoundingClientRect();
    // get the mouse coordinates, subtract the canvas top left and any scrolling
    mouse.x = event.pageX - rect.left - scrollX;
    mouse.y = event.pageY - rect.top - scrollY;
    // first normalize the mouse coordinates from 0 to 1 (0,0) top left
    // off canvas and (1,1) bottom right by dividing by the rect width and height
    mouse.x /= rect.width;
    mouse.y /= rect.height;

    // then scale to canvas coordinates by multiplying the normalized coords with the canvas resolution

    mouse.x *= context.canvas.width;
    mouse.y *= context.canvas.height;
    if (event.type === "mousedown" && event.target.id == "myCanvas") {
        mouse[mouse.buttonNames[event.which - 1]] = true;  // set the button as down
    } else if (event.type === "mouseup") {
        mouse[mouse.buttonNames[event.which - 1]] = false; // set the button up
    }

    if (mouse.b1) {  // is button 1 down?
        context.beginPath();
        context.moveTo(mouse.lastX, mouse.lastY);
        context.lineTo(mouse.x, mouse.y);
        context.stroke();
    }
    // save the last known mouse coordinate here not in the mouse event
    mouse.lastX = mouse.x;
    mouse.lastY = mouse.y;

}
