const imageUpload = document.getElementById("imageUpload");
const previewImage = document.getElementById("previewImage");
const resultImage = document.getElementById("resultImage");
const sliderHandle = document.getElementById("sliderHandle");
const sliderOverlay = document.getElementById("sliderOverlay");
const submitBtn = document.getElementById("submitBtn");
const loader = document.getElementById("loading");
const downloadBtn = document.getElementById("downloadBtn");

let uploadedImage = null;

// Image Preview
imageUpload.addEventListener("change", () => {
  const file = imageUpload.files[0];
  if (file) {
    uploadedImage = file;
    const reader = new FileReader();
    reader.onload = () => {
      previewImage.src = reader.result;
      resultImage.src = ""; // Reset result
      downloadBtn.classList.add("hidden");
    };
    reader.readAsDataURL(file);
  }
});

// Submit and Upscale
submitBtn.addEventListener("click", async () => {
  if (!uploadedImage) {
    alert("Please upload an image first.");
    return;
  }

  submitBtn.disabled = true;
  loader.classList.remove("hidden");
  resultImage.src = "";

  const formData = new FormData();
  formData.append("image", uploadedImage);

  try {
    const response = await fetch("https://tree1.sahajsharma921.workers.dev", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Upscale failed");

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    resultImage.src = objectUrl;
    resultImage.onload = () => {
      downloadBtn.href = objectUrl;
      downloadBtn.classList.remove("hidden");

      // Animate slider back and forth
      sliderOverlay.style.transition = "left 1.5s ease-in-out";
      sliderOverlay.style.left = "0%";
      setTimeout(() => {
        sliderOverlay.style.left = "100%";
        setTimeout(() => {
          sliderOverlay.style.left = "50%";
        }, 1500);
      }, 1500);
    };
  } catch (err) {
    console.error(err);
    alert("Upscaling failed. Try again.");
  } finally {
    loader.classList.add("hidden");
    submitBtn.disabled = false;
  }
});

// Drag to adjust slider
let isDragging = false;
sliderHandle.addEventListener("mousedown", () => (isDragging = true));
window.addEventListener("mouseup", () => (isDragging = false));
window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const box = document.querySelector(".slider-box");
  const rect = box.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
  sliderOverlay.style.left = `${percent}%`;
});
