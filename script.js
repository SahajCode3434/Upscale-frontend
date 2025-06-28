const imageInput = document.getElementById('imageUpload');
const beforePreview = document.getElementById('previewImage');
const afterPreview = document.getElementById('resultImage');
const upscaleBtn = document.getElementById('submitBtn');

let uploadedFile = null;

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) {
    uploadedFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      beforePreview.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});

upscaleBtn.addEventListener("click", async () => {
  if (!uploadedFile) {
    alert("Please upload an image.");
    return;
  }

  upscaleBtn.disabled = true;
  upscaleBtn.textContent = "Upscaling...";

  const formData = new FormData();
  formData.append("image", uploadedFile);

  try {
    const response = await fetch("https://tree1.sahajsharma921.workers.dev", {
      method: "POST",
      body: formData
    });

    if (!response.ok) throw new Error("Upscale failed");

    const blob = await response.blob();
    afterPreview.src = URL.createObjectURL(blob);
  } catch (err) {
    alert("Error during upscaling.");
    console.error(err);
  } finally {
    upscaleBtn.disabled = false;
    upscaleBtn.textContent = "Upscale Image";
  }
});
