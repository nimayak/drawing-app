// Variable initialisation
var canvas = document.querySelector( '#canvas' );
var context = canvas.getContext( '2d' );
var linePoints = [];
var toolMode = 'draw'
var toolSize = 5;
var toolColor = '#5f3a27'
var canvasState = [];
var undoButton = document.querySelector( '[data-action=undo]' );

// Defaults
context.strokeStyle = "#5f3a27";
context.lineWidth = 5;
canvas.style.cursor = 'url( images/size'+toolSize+'.cur ), crosshair';

// asks to clear canvas aftle 5 mins of being idle
window.setTimeout(idleClearCanvas, 300000);

// Event listeners
canvas.addEventListener( 'mousedown', draw );
//touchscreen
canvas.addEventListener( 'touchstart', draw );
window.addEventListener( 'mouseup', stop );
window.addEventListener( 'touchend', stop );
//to detect when the browser window is resized:
window.addEventListener( 'resize', resizeCanvas );
document.querySelector( '#tools' ).addEventListener( 'click', selectTool );
document.querySelector( '#colors' ).addEventListener( 'click', selectTool );

resizeCanvas();

// Functions
function idleClearCanvas() {
  var result = confirm( 'You have been idle for 5 mins. Do you want to clear the canvas and start anew?' );
  if ( result ) {
    context.clearRect( 0, 0, canvas.width, canvas.height );
    canvasState.length = 0;
    undoButton.classList.add( 'disabled' );
  }
}

function clearCanvas() {
  var result = confirm( 'Are you sure you want to clear the canvas and start anew?' );
  if ( result ) {
    context.clearRect( 0, 0, canvas.width, canvas.height );
    canvasState.length = 0;
    undoButton.classList.add( 'disabled' );
  }
}

function draw( e ) {
  if ( e.which === 1  || e.type === 'touchstart' || e.type === 'touchmove') {
    window.addEventListener( 'mousemove', draw );
    window.addEventListener( 'touchmove', draw );
    var mouseX = e.pageX - canvas.offsetLeft;
    var mouseY = e.pageY - canvas.offsetTop;
    var mouseDrag = e.type === 'mousemove';
    if ( e.type === 'touchstart' || e.type === 'touchmove' ) {
      //console.log( e );
      mouseX = e.touches[0].pageX - canvas.offsetLeft;
      mouseY = e.touches[0].pageY - canvas.offsetTop;
      mouseDrag = e.type === 'touchmove';
    }
    if ( e.type === 'mousedown' || e.type === 'touchstart') saveState();
    linePoints.push( { x: mouseX, y: mouseY, drag: mouseDrag, width: toolSize, color: toolColor } );
    updateCanvas();
  }
}

function highlightButton( button ) {
  var buttons = button.parentNode.querySelectorAll( 'img' );
  buttons.forEach( function( element ){ element.classList.remove( 'active' ) } );
  button.classList.add( 'active' );
}

function renderLine() {
  for ( var i = 0, length = linePoints.length; i < length; i++ ) {
    if ( !linePoints[i].drag ) {
      //context.stroke();
      context.lineJoin = "round";
      context.lineCap = "round";
      // brush effect
      context.shadowBlur = 10;
      context.shadowColor = 'rgb(0, 0, 0)';
      context.beginPath();
      context.lineWidth = linePoints[i].width;
      context.strokeStyle = linePoints[i].color;
      context.moveTo( linePoints[i].x, linePoints[i].y );
      context.lineTo( linePoints[i].x + 0.5, linePoints[i].y + 0.5 );
    } else {
      context.lineTo( linePoints[i].x, linePoints[i].y );
    }
  }

  if ( toolMode === 'erase' ) {
    context.globalCompositeOperation = 'destination-out';
  } else {
    context.globalCompositeOperation = 'source-over';
  }
  
  context.stroke();
}

function saveState() {
  canvasState.unshift( context.getImageData( 0, 0, canvas.width, canvas.height ) );
  linePoints = [];
  if ( canvasState.length > 25 ) canvasState.length = 25;
  undoButton.classList.remove( 'disabled' );
}

function selectTool( e ) {
  if ( e.target === e.currentTarget ) return;
  if ( !e.target.dataset.action ) highlightButton( e.target );
  toolSize = e.target.dataset.size || toolSize;
  canvas.style.cursor = 'url( images/size'+toolSize+'.cur ), crosshair';
  toolMode = e.target.dataset.mode || toolMode;
  toolColor = e.target.dataset.color || toolColor;
  if ( e.target === undoButton ) undoState();
  if ( e.target.dataset.action == 'delete' ) clearCanvas();
}

function stop( e ) {
  if ( e.which === 1 || e.type === 'touchend' ) {
    window.removeEventListener( 'mousemove', draw );
    window.removeEventListener( 'touchmove', draw );
  }
}

function undoState() {
  context.putImageData( canvasState.shift(), 0, 0 );
  if ( !canvasState.length ) undoButton.classList.add( 'disabled' );
}

function updateCanvas() {
  context.clearRect( 0, 0, canvas.width, canvas.height );
  context.putImageData( canvasState[ 0 ], 0, 0 );
  renderLine();
}

function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  if ( canvasState.length ) updateCanvas();
}

function bg() {
   canvas.style.backgroundImage = "url('images/paper.jpg')";

}

function bg1() {
   canvas.style.backgroundImage = "url('images/bg1.jpeg')"; 
}

function bg2() {
   canvas.style.backgroundImage = "url('images/bg2.jpg')";
}

function bg3() {
   canvas.style.backgroundImage = "url('images/bg3.jpg')";
}


function blurOn() {
  canvas.style.filter = "blur(2px)";
}

function blurOff() {
  canvas.style.filter = "blur(0px)";

}




