const WORKER_URL = "tree1.sahajsharma921.workers.dev"; // Replace with your actual worker URL if different

document.getElementById("upload-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const fileInput = document.getElementById("image");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select an image.");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status}\n${errorText}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const resultImage = document.getElementById("result-image");
    resultImage.src = url;
    resultImage.style.display = "block";

  } catch (error) {
    alert("Upscale failed: " + error.message);
  }
});
