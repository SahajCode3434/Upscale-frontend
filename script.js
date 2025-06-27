const imageUpload = document.getElementById("imageUpload");
const previewImage = document.getElementById("previewImage");
const resultImage = document.getElementById("resultImage");
const submitBtn = document.getElementById("submitBtn");

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
  submitBtn.textContent = "Upscaling...";

  const formData = new FormData();
  formData.append("image", uploadedImage);

  try {
    const response = await fetch("tree1.sahajsharma921.workers.dev", {
      method: "POST",
      body: formData,
    });

    const blob = await response.blob();
    resultImage.src = URL.createObjectURL(blob);
  } catch (error) {
    alert("Failed to upscale image.");
    console.error(error);
  }

  submitBtn.disabled = false;
  submitBtn.textContent = "Upscale Image";
});
