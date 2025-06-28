const imageUpload = document.getElementById("imageUpload");
const previewImage = document.getElementById("previewImage");
const resultImage = document.getElementById("resultImage");
const submitBtn = document.getElementById("submitBtn");
const loader = document.getElementById("loading");

let uploadedImage = null;

imageUpload.addEventListener("change", () => {
  const file = imageUpload.files[0];
  if (file) {
    uploadedImage = file;
    const reader = new FileReader();
    reader.onload = () => {
      previewImage.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});

submitBtn.addEventListener("click", async () => {
  if (!uploadedImage) {
    alert("Please upload an image first.");
    return;
  }

  submitBtn.disabled = true;
  loader.classList.remove("hidden");

  const formData = new FormData();
  formData.append("image", uploadedImage);

  try {
    const response = await fetch("https://tree1.sahajsharma921.workers.dev", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error(`Upscale failed: ${response.statusText}`);
    const blob = await response.blob();
    resultImage.src = URL.createObjectURL(blob);
  } catch (err) {
    alert("Failed to upscale image.");
    console.error(err);
  } finally {
    loader.classList.add("hidden");
    submitBtn.disabled = false;
  }
});
