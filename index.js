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

    // Obtener el stream de la cámara con los nuevos constraints
    stream = await navigator.mediaDevices.getUserMedia(constraints);

    // Mostrar el video en el elemento de video
    videoElement.srcObject = stream;
  } catch (error) {
    console.error('Error al acceder a la cámara: ', error);
  }
}

// Función para capturar la imagen de la cámara
function captureImage() {
  // Crear un lienzo temporal
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  const context = canvas.getContext('2d');
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  // Crear un elemento de imagen para mostrar la captura
  const img = new Image();
  img.src = canvas.toDataURL('image/png');

  // filtro de nitidez

  Caman(img, function () {
    this.sharpen(40); // Ajusta el valor según el grado de nitidez deseado
    this.render(function () {
      // Mostrar la imagen filtrada
      imageElement.src = this.toDataURL();
    });
  });


  // Mostrar la imagen capturada en el elemento img
  imageElement.src = img.src;
  imageElement.setAttribute('data-url', img.src);

  // Agregar la imagen capturada al arreglo de imágenes
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

  // Asignar eventos a la nueva imagen capturada
  newDiv.addEventListener('click', function () {
    const selectedContainer = document.querySelector('.image-container.selected');
    if (selectedContainer) {
      selectedContainer.classList.remove('selected');
    }
    newDiv.classList.add('selected');

    const imageSrc = newImg.getAttribute('data-url');
    loadOpenCV(function () {
      const demoResult = document.getElementById('demo-result');
      demoResult.innerHTML = '';

      const resultImg = document.createElement('img');
      resultImg.src = imageSrc;

      resultImg.onload = function () {
        const resultCanvas = scanner.extractPaper(resultImg, 386, 500);
        demoResult.appendChild(resultCanvas);

        const highlightedCanvas = scanner.highlightPaper(resultImg);
        demoResult.appendChild(highlightedCanvas);
      };
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
closeBtn.addEventListener('click', closeCamera);
