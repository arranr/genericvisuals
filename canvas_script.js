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


// Function to clear the canvas
function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}


// Function to save the drawing
// GitHub API configuration
const username = 'arranr';
const repository = 'genericvisuals';
const token = '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';

// Function to save the drawing as a JPEG image and upload it to GitHub
function saveDrawing() {
  // Convert the canvas to a data URL
  const dataURL = canvas.toDataURL('image/jpeg');

  // Create a file name for the image
  const fileName = `drawing_${Date.now()}.jpg`;

  // Create a file blob from the data URL
  const fileBlob = dataURLtoBlob(dataURL);

  // Create a FormData object
  const formData = new FormData();
  formData.append('file', fileBlob, fileName);

  // Send the image file to GitHub repository using the GitHub API
  $.ajax({
    url: `https://api.github.com/repos/${username}/${repository}/contents/images/${fileName}`,
    type: 'PUT',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    },
    data: JSON.stringify({
      message: 'Upload image',
      content: btoa(formData.get('file'))
    })
  })
  .done(function(response) {
    console.log('Drawing saved to GitHub repository');
  })
  .fail(function(error) {
    console.error('Error saving drawing to GitHub repository:', error);
  });
}

// Function to convert data URL to Blob
function dataURLtoBlob(dataURL) {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
