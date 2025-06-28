const imageUpload = document.getElementById("imageUpload");
const previewImage = document.getElementById("previewImage");
const resultImage = document.getElementById("resultImage");
const sliderHandle = document.getElementById("sliderHandle");
const sliderWrapper = document.getElementById("sliderWrapper");
const submitBtn = document.getElementById("submitBtn");
const loader = document.getElementById("loading");
const downloadBtn = document.getElementById("downloadBtn");

let uploadedImage = null;

// Upload Preview
imageUpload.addEventListener("change", () => {
  const file = imageUpload.files[0];
  if (file) {
    uploadedImage = file;
    const reader = new FileReader();
    reader.onload = () => {
      previewImage.src = reader.result;
      resultImage.src = ""; // Clear old result
      sliderWrapper.classList.add("opacity-0");
    };
    reader.readAsDataURL(file);
  }
});

// Submit to backend
submitBtn.addEventListener("click", async () => {
  if (!uploadedImage) {
    alert("Please upload an image first.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Upscaling...";
  loader.classList.remove("hidden");

  const formData = new FormData();
  formData.append("image", uploadedImage);

  try {
    const response = await fetch("https://tree1.sahajsharma921.workers.dev", {
      method: "POST",
      body: formData,
    });

    const blob = await response.blob();
    const resultURL = URL.createObjectURL(blob);
    resultImage.src = resultURL;

    resultImage.onload = () => {
      sliderWrapper.classList.remove("opacity-0");
      downloadBtn.href = resultURL;
      downloadBtn.download = "upscaled.png";

      // Trigger slider animation: left to right and center
      let pos = 0;
      const animation = setInterval(() => {
        pos += 1;
        updateSlider(pos);
        if (pos >= 100) {
          clearInterval(animation);
          setTimeout(() => updateSlider(50), 500);
        }
      }, 8);
    };
  } catch (err) {
    alert("Upscale failed. Try again later.");
    console.error(err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Upscale Image";
    loader.classList.add("hidden");
  }
});

// Update slider position
function updateSlider(percent) {
  const clipWidth = `${percent}%`;
  resultImage.style.clipPath = `inset(0 0 0 ${clipWidth})`;
  sliderHandle.style.left = clipWidth;
}

// Drag to slide
let isDragging = false;
sliderHandle.addEventListener("mousedown", () => (isDragging = true));
window.addEventListener("mouseup", () => (isDragging = false));
window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const rect = sliderWrapper.getBoundingClientRect();
  let x = ((e.clientX - rect.left) / rect.width) * 100;
  x = Math.max(0, Math.min(100, x));
  updateSlider(x);
});
