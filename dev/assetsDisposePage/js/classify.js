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
        resultElement.textContent = "Classification Result: Awaiting Image Upload";
        return;
    }
    
    const formData = new FormData();
    formData.append('image', input.files[0]);

    const response = await fetch('/api/classify', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    
    // Wait for 3 seconds before updating the UI with the prediction result
    setTimeout(() => {
        resultElement.classList.remove("dotsAnimation");
        resultElement.textContent = `Classification Result: ${result.prediction}`;

        // Reset loading bar
        loadingBarContainer.style.display = "none";
        loadingBar.style.animation = "none";
        loadingBar.style.width = "0";
    }, 3000);
}