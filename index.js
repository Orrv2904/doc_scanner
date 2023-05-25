// Obtener referencias a los elementos del DOM
const openBtn = document.getElementById('openBtn');
const captureBtn = document.getElementById('captureBtn');
const closeBtn = document.getElementById('closeBtn');
const videoElement = document.getElementById('videoElement');
const imageElement = document.getElementById('imageElement');
let stream;

// Función para abrir la cámara
async function openCamera() {
  try {
    // Solicitar permiso para acceder a la cámara
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    // Mostrar el video en el elemento de video
    videoElement.srcObject = stream;
  } catch (error) {
    console.error('Error al acceder a la cámara: ', error);
  }
}

// Función para tomar una captura de imagen
function captureImage() {
  // Crear un lienzo temporal
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  
  // Dibujar el video en el lienzo
  const context = canvas.getContext('2d');
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  
  // Obtener la imagen capturada en formato base64
  const imageData = canvas.toDataURL('image/png');
  
  // Mostrar la imagen capturada en la etiqueta <img>
  imageElement.src = imageData;
}

// Función para cerrar la cámara
function closeCamera() {
  // Detener el flujo de video
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    videoElement.srcObject = null;
  }
}

// Asignar eventos a los botones
openBtn.addEventListener('click', openCamera);
captureBtn.addEventListener('click', captureImage);
closeBtn.addEventListener('click', closeCamera);
