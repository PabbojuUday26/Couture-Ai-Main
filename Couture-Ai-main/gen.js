document.addEventListener("DOMContentLoaded", function () {
    const generateBtn = document.getElementById("generateBtn");
    const userInput = document.getElementById("description");
    const imageContainer = document.getElementById("imageContainer");
    const loaderContainer = document.getElementById("loaderContainer");

    // Create the Download and Save Buttons dynamically
    let downloadBtn = document.createElement("button");
    downloadBtn.id = "downloadBtn";
    downloadBtn.textContent = "Download Image";
    downloadBtn.style.display = "none";
    downloadBtn.classList.add("button", "button-item");

    let saveBtn = document.createElement("button");
    saveBtn.id = "saveToWardrobeBtn";
    saveBtn.textContent = "Save to Wardrobe";
    saveBtn.style.display = "none";
    saveBtn.classList.add("button", "button-item");

    // Find the sidebar and insert the buttons
    const sidebar = document.querySelector(".sidebar");
    sidebar.appendChild(downloadBtn);
    sidebar.appendChild(saveBtn);

    generateBtn.addEventListener("click", async function () {
        const description = userInput.value.trim();
        if (!description) {
            alert("⚠️ Please enter a clothing description.");
            return;
        }

        // Show loader animation
        loaderContainer.style.display = "block";
        imageContainer.innerHTML = "";
        downloadBtn.style.display = "none";
        saveBtn.style.display = "none";

        const apiUrl = "http://localhost:5000/generate";

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ inputs: description }) // Ensure correct JSON format
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);

            // Hide loader and display image
            loaderContainer.style.display = "none";
            imageContainer.innerHTML = `<img src="${imageUrl}" alt="Generated Clothing Image">`;

            // Show buttons
            downloadBtn.style.display = "block";
            saveBtn.style.display = "block";

            // Set download functionality
            downloadBtn.onclick = function () {
                const link = document.createElement("a");
                link.href = imageUrl;
                link.download = "CoutureAI_Fashion.png";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };

            // Set save-to-wardrobe functionality
            saveBtn.onclick = async function () {
                await saveToWardrobe(imageBlob);
            };

        } catch (error) {
            console.error("Error:", error);
            loaderContainer.style.display = "none";
            imageContainer.innerHTML = `
                <p style="color: red; font-weight: bold; text-align: center;">
                    ❌ Failed to generate image. Please try again later.
                </p>
            `;
        }
    });

    // Convert Blob to Base64 (for persistent storage)
    async function convertBlobToBase64(blob) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }

    // Save Image to Wardrobe
    async function saveToWardrobe(imageBlob) {
        let wardrobeImages = JSON.parse(localStorage.getItem("wardrobeImages")) || [];
        const base64Image = await convertBlobToBase64(imageBlob);

        if (!wardrobeImages.includes(base64Image)) {
            wardrobeImages.push(base64Image);
            localStorage.setItem("wardrobeImages", JSON.stringify(wardrobeImages));
            alert("✅ Image saved to your wardrobe!");
        } else {
            alert("⚠️ This image is already in your wardrobe.");
        }
    }
});
