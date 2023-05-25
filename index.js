// Obtener referencias a los elementos del DOM
const openBtn = document.getElementById('openBtn');
const closeBtn = document.getElementById('closeBtn');
const videoElement = document.getElementById('videoElement');
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
closeBtn.addEventListener('click', closeCamera);
