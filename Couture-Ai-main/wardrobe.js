document.addEventListener("DOMContentLoaded", function () {
    const wardrobeGrid = document.getElementById("wardrobe-grid");
    const clearWardrobeBtn = document.getElementById("clearWardrobe");

    if (!wardrobeGrid || !clearWardrobeBtn) {
        console.error("Wardrobe grid or clear button not found!");
        return;
    }

    // Load wardrobe from local storage
    function loadWardrobe() {
        wardrobeGrid.innerHTML = ""; // Clear grid
        const savedImages = JSON.parse(localStorage.getItem("wardrobeImages")) || [];
        
        if (savedImages.length === 0) {
            wardrobeGrid.innerHTML = `<p style="text-align: center; font-weight: bold;">Your wardrobe is empty.</p>`;
            return;
        }

        savedImages.forEach((imageUrl, index) => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("wardrobe-item");

            const img = document.createElement("img");
            img.src = imageUrl;
            img.alt = "Saved Clothing Image";

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "X";
            removeBtn.classList.add("remove-btn");
            removeBtn.addEventListener("click", function () {
                removeItem(index, itemDiv);
            });

            itemDiv.appendChild(img);
            itemDiv.appendChild(removeBtn);
            wardrobeGrid.appendChild(itemDiv);
        });
    }

    // Remove item from wardrobe (with fade-out effect)
    function removeItem(index, itemDiv) {
        itemDiv.style.opacity = "0"; // Apply fade-out effect
        setTimeout(() => {
            let savedImages = JSON.parse(localStorage.getItem("wardrobeImages")) || [];
            savedImages.splice(index, 1);
            localStorage.setItem("wardrobeImages", JSON.stringify(savedImages));
            loadWardrobe(); // Refresh the grid
        }, 300); // 300ms delay to match fade-out animation
    }

    // Clear wardrobe with confirmation
    clearWardrobeBtn.addEventListener("click", function () {
        if (confirm("Are you sure you want to clear your entire wardrobe?")) {
            localStorage.removeItem("wardrobeImages");
            loadWardrobe();
        }
    });

    // Convert Blob URL to Base64 (to store images persistently)
    async function convertBlobToBase64(blobUrl) {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }

    // Save image to wardrobe (Use this function in the image generator)
    async function saveToWardrobe(imageBlobUrl) {
        let wardrobeImages = JSON.parse(localStorage.getItem("wardrobeImages")) || [];

        const base64Image = await convertBlobToBase64(imageBlobUrl);

        if (!wardrobeImages.includes(base64Image)) {
            wardrobeImages.push(base64Image);
            localStorage.setItem("wardrobeImages", JSON.stringify(wardrobeImages));
            alert("✅ Image saved to your wardrobe!");
            loadWardrobe(); // Refresh immediately
        } else {
            alert("⚠️ This image is already in your wardrobe.");
        }
    }

    // Load wardrobe on page load
    loadWardrobe();

    // Make the save function globally accessible (for use in your image generator script)
    window.saveToWardrobe = saveToWardrobe;
});
