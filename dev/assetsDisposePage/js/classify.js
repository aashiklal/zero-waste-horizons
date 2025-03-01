async function classifyImage() {
    const resultElement = document.getElementById('result');
    const loadingBarContainer = document.getElementById('loading-bar-container');
    const loadingBar = document.getElementById('loading-bar');
    
    // Start the dots animation for "Classifying..."
    resultElement.textContent = "Classification Result: Classifying";

    // Make sure animation is running
    resultElement.classList.add("dotsAnimation");

    // Start loading bar animation
    loadingBarContainer.style.display = "block"; 
    loadingBar.style.animation = "loadingBarAnimation 3s forwards";

    const input = document.getElementById('imageUpload');
    if (!input.files.length) {
        // Reset text if no image is provided
        resultElement.textContent = "Classification Result: No Image Uploaded. Awaiting Image Upload";

        // Reset loading bar
        loadingBarContainer.style.display = "none";
        loadingBar.style.animation = "none";
        loadingBar.style.width = "0";
        return;
    }
    
    const formData = new FormData();
    formData.append('image', input.files[0]);

    try {
        const response = await fetch('/api/classify', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const result = await response.json();
        
        // Wait for 3 seconds before updating the UI with the prediction result
        setTimeout(() => {
            resultElement.classList.remove("dotsAnimation");
            resultElement.textContent = `Classification Result: ${result.prediction}`;

            if (result.prediction.toLowerCase() === "hazardous") {
                const disposeElement = document.getElementById('hero-section');
                disposeElement.scrollIntoView({ behavior: 'smooth' });
            }            

            // Reset loading bar
            loadingBarContainer.style.display = "none";
            loadingBar.style.animation = "none";
            loadingBar.style.width = "0";
        }, 3000);

    } catch (error) {
        console.error("Error during image classification:", error);
        resultElement.classList.remove("dotsAnimation");
        resultElement.textContent = `${error.message}`;

        // Reset loading bar
        loadingBarContainer.style.display = "none";
        loadingBar.style.animation = "none";
        loadingBar.style.width = "0";
    }
}