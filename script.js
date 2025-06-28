const imageUpload = document.getElementById("imageUpload");
const uploadBox = document.getElementById("uploadBox");
const loader = document.getElementById("loader");
const resultSection = document.getElementById("resultSection");
const beforeImage = document.getElementById("beforeImage");
const afterImage = document.getElementById("afterImage");
const slider = document.getElementById("slider");
const divider = document.getElementById("divider");
const upscaleBtn = document.getElementById("upscaleBtn");

let uploadedImage = null;

// Handle file upload preview
imageUpload.addEventListener("change", () => {
  const file = imageUpload.files[0];
  if (file) {
    uploadedImage = file;
    const reader = new FileReader();
    reader.onload = () => {
      beforeImage.src = reader.result;
      afterImage.src = reader.result;
      resultSection.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

// Handle upscale
upscaleBtn.addEventListener("click", async () => {
  if (!uploadedImage) {
    alert("Please upload an image first.");
    return;
  }

  upscaleBtn.disabled = true;
  loader.style.display = "block";
  slider.style.display = "none";

  const formData = new FormData();
  formData.append("image", uploadedImage);

  try {
    const response = await fetch("https://tree1.sahajsharma921.workers.dev", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Upscale failed");
    }

    const blob = await response.blob();
    const imageURL = URL.createObjectURL(blob);
    afterImage.src = imageURL;

    // Show pixelcut-style slider animation
    animateSlider();
    slider.style.display = "block";
  } catch (err) {
    alert("Upscaling failed.");
    console.error(err);
  } finally {
    loader.style.display = "none";
    upscaleBtn.disabled = false;
  }
});

// Animate slider like pixelcut
function animateSlider() {
  let progress = 0;
  let direction = 1;
  const interval = setInterval(() => {
    progress += direction * 2;
    if (progress >= 100 || progress <= 0) direction *= -1;
    slider.style.width = `${progress}%`;
    divider.style.left = `${progress}%`;
  }, 30);

  setTimeout(() => clearInterval(interval), 2000);
}

// Slider drag
let isDragging = false;
divider.addEventListener("mousedown", () => (isDragging = true));
document.addEventListener("mouseup", () => (isDragging = false));
document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const rect = resultSection.getBoundingClientRect();
  let percent = ((e.clientX - rect.left) / rect.width) * 100;
  percent = Math.max(0, Math.min(100, percent));
  slider.style.width = `${percent}%`;
  divider.style.left = `${percent}%`;
});
