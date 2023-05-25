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

  // Crear un contenedor de imagen
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('image-container');

  // Agregar la imagen al contenedor
  const newImg = document.createElement('img');
  newImg.src = img.src;
  newImg.setAttribute('data-url', img.src);
  newImg.alt = 'Imagen capturada';

  imageContainer.appendChild(newImg);

  // Agregar el contenedor de imagen al arreglo de imágenes
  const demoImages = document.getElementById('demo-images');
  demoImages.appendChild(imageContainer);

  $('#demo-images .image-container').click(function () {
    $('.image-container.selected').removeClass('selected')
    $(this).addClass('selected')
    const imageSrc = $(this).find('img').data('url')
    loadOpenCV(function () {
      $('#demo-result').empty()

      const newImg = document.createElement("img")
      newImg.src = imageSrc

      newImg.onload = function () {
        const resultCanvas = scanner.extractPaper(newImg, 386, 500);
        $('#demo-result').append(resultCanvas);

        const highlightedCanvas = scanner.highlightPaper(newImg)
        $('#demo-result').append(highlightedCanvas);
      }
    })
  })
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
