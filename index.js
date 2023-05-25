// Obtener referencias a los elementos del DOM
const openBtn = document.getElementById('openBtn');
const captureBtn = document.getElementById('captureBtn');
const closeBtn = document.getElementById('closeBtn');
const videoElement = document.getElementById('videoElement');
const canvasElement = document.getElementById('canvasElement');
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
  // Establecer el tamaño del lienzo igual al tamaño del video
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;
  
  // Dibujar el video en el lienzo
  const context = canvasElement.getContext('2d');
  context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
  
  // Obtener la imagen capturada en formato base64
  const imageData = canvasElement.toDataURL('image/png');
  
  // Mostrar la imagen capturada en una nueva ventana o en la consola
  const image = new Image();
  image.src = imageData;
  const w = window.open("");
  w.document.write(image.outerHTML);
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
