const imageUpload = document.getElementById("imageUpload");
const previewImage = document.getElementById("previewImage");
const resultImage = document.getElementById("resultImage");
const upscaleBtn = document.getElementById("upscaleBtn");
const loader = document.getElementById("loader");

let uploadedFile = null;

imageUpload.addEventListener("change", () => {
  const file = imageUpload.files[0];
  if (file) {
    uploadedFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      previewImage.src = reader.result;
      resultImage.src = "";
    };
    reader.readAsDataURL(file);
  }
});

upscaleBtn.addEventListener("click", async () => {
  if (!uploadedFile) {
    alert("Please select an image first.");
    return;
  }

  upscaleBtn.disabled = true;
  loader.classList.remove("hidden");

  const formData = new FormData();
  formData.append("image", uploadedFile);

  try {
    const response = await fetch("https://tree1.sahajsharma921.workers.dev", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upscale image.");
    }

    const blob = await response.blob();
    resultImage.src = URL.createObjectURL(blob);
  } catch (error) {
    alert("Error upscaling image. Please try again.");
    console.error(error);
  } finally {
    upscaleBtn.disabled = false;
    loader.classList.add("hidden");
  }
});
