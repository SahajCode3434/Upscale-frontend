const imageInput = document.getElementById("image");
const preview = document.getElementById("preview");
const uploadBtn = document.getElementById("uploadBtn");
const result = document.getElementById("result");

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
  }
});

uploadBtn.addEventListener("click", async () => {
  const file = imageInput.files[0];
  if (!file) {
    alert("Please upload an image.");
    return;
  }

  uploadBtn.disabled = true;
  uploadBtn.textContent = "Upscaling...";

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("tree1.sahajsharma921.workers.dev", {
      method: "POST",
      body: formData
    });

    if (!response.ok) throw new Error("Upscaling failed");

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    result.innerHTML = `<img src="${url}" alt="Upscaled Image" />`;
  } catch (err) {
    result.innerHTML = `<p style="color: red;">Error: ${err.message}</p>`;
  } finally {
    uploadBtn.disabled = false;
    uploadBtn.textContent = "Upscale";
  }
});
