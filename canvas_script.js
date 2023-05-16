// Canvas variables
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let lastX, lastY;
let isDrawing = false;

// Event listener for mouse movements
canvas.addEventListener('mousedown', function(event) {
  isDrawing = true;
  lastX = event.clientX - canvas.offsetLeft;
  lastY = event.clientY - canvas.offsetTop;
});

canvas.addEventListener('mousemove', function(event) {
  if (isDrawing) {
    let currentX = event.clientX - canvas.offsetLeft;
    let currentY = event.clientY - canvas.offsetTop;
    draw(currentX, currentY);
  }
});

// Event listener for save button
let saveBtn = document.getElementById('saveBtn');
saveBtn.addEventListener('click', function() {
  saveDrawing();
});

// Event listener for clear button
let clearBtn = document.getElementById('clearBtn');
clearBtn.addEventListener('click', function() {
  clearCanvas();
});

// Color picker functionality
const colorPicker = document.getElementById('colorPicker');
let currentColor = colorPicker.value;

colorPicker.addEventListener('change', function(event) {
  currentColor = event.target.value;
});

// Event listener for mouse leaving the canvas
canvas.addEventListener('mouseleave', function() {
  isDrawing = false;
});

// Event listener for mouse button release
document.addEventListener('mouseup', function() {
  isDrawing = false;
});

// Function to draw on the canvas
function draw(x, y) {
  context.beginPath();
  context.moveTo(lastX, lastY);
  context.lineTo(x, y);
  context.strokeStyle = currentColor; // Set the stroke color
  context.lineWidth = 5;
  context.lineCap = 'round';
  context.stroke();
  context.closePath();

  lastX = x;
  lastY = y;
}

// Function to save the drawing
function saveDrawing() {
  const dataURL = canvas.toDataURL('image/jpeg');
  const fileName = `drawing_${Date.now()}.jpg`;
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = fileName;
  link.click();
}

// Function to clear the canvas
function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}
