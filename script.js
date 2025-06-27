const uploadInput = document.getElementById('image-upload');
const upscaleBtn = document.getElementById('upscale-btn');
const statusText = document.getElementById('status-text');
const outputImg = document.getElementById('output-img');

const WORKER_URL = "https://your-worker-name.workers.dev"; // Replace this

upscaleBtn.addEventListener('click', async () => {
  const file = uploadInput.files[0];
  if (!file) return alert('Please upload an image.');

  statusText.textContent = 'Processing...';
  outputImg.style.display = 'none';

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Upscaling failed');

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    outputImg.src = imageUrl;
    outputImg.style.display = 'block';
    statusText.textContent = 'Upscaled Result:';
  } catch (err) {
    console.error(err);
    statusText.textContent = 'Error: ' + err.message;
  }
});
