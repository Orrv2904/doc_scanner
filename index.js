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
    const constraints = {
      video: {
        facingMode: 'environment',
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30, max: 60 }
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    const track = stream.getVideoTracks()[0];
    const capabilities = track.getCapabilities();
    const settings = track.getSettings();

    // Redimensionar la resolución si es necesario
    if (settings.width > 1280 || settings.height > 720) {
      const aspectRatio = settings.width / settings.height;
      let newWidth = 1280;
      let newHeight = 720;

      if (aspectRatio > 1) {
        newHeight = Math.floor(newWidth / aspectRatio);
      } else {
        newWidth = Math.floor(newHeight * aspectRatio);
      }

      const updatedConstraints = {
        video: {
          width: { ideal: newWidth },
          height: { ideal: newHeight },
        },
      };

      stream.getTracks().forEach((track) => {
        track.stop();
      });

      const updatedStream = await navigator.mediaDevices.getUserMedia(updatedConstraints);
      videoElement.srcObject = updatedStream;
    } else {
      videoElement.srcObject = stream;
    }
  } catch (error) {
    console.error('Error al acceder a la cámara: ', error);
  }
}


// Función para tomar una captura de image

function captureImage() {
  // Crear un lienzo temporal
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  const context = canvas.getContext('2d');
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  // Crear un elemento de imagen para mostrar la captura
  const img = document.createElement('img');
  img.src = canvas.toDataURL('image/png');

  // Mostrar la imagen capturada en la etiqueta <img>
  imageElement.src = img.src;
  imageElement.setAttribute('data-url', img.src);

  const newDiv = document.createElement('div');
  newDiv.className = 'image-container';
  newDiv.style.marginBottom = '0';

  const newImg = document.createElement('img');
  newImg.src = img.src;
  newImg.setAttribute('data-url', img.src);
  newImg.alt = 'jscanify test image 2';

  newDiv.appendChild(newImg);

  const demoImages = document.getElementById('demo-images');
  demoImages.appendChild(newDiv);
  addImg();
}

function addImg() {
  const imageContainers = document.querySelectorAll('#demo-images .image-container');

  imageContainers.forEach(function (container) {
    container.addEventListener('click', function () {
      const selectedContainer = document.querySelector('.image-container.selected');
      if (selectedContainer) {
        selectedContainer.classList.remove('selected');
      }
      container.classList.add('selected');

      const imageSrc = container.querySelector('img').getAttribute('data-url');
      loadOpenCV(function () {
        const demoResult = document.getElementById('demo-result');
        demoResult.innerHTML = '';

        const newImg = document.createElement('img');
        newImg.src = imageSrc;

        newImg.onload = function () {
          const resultCanvas = scanner.extractPaper(newImg, 386, 500);
          demoResult.appendChild(resultCanvas);

          const highlightedCanvas = scanner.highlightPaper(newImg);
          demoResult.appendChild(highlightedCanvas);
        };
      });
    });
  });
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
// closeBtn.addEventListener('click', closeCamera);
