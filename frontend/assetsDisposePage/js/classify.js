async function classifyImage() {
    // Check session storage to see if the user has already accepted the terms.
    if (sessionStorage.getItem('acceptedTerms')) {
        // If the user has already accepted the terms, proceed with classification.
        await proceedWithClassification();
        return;
    }

    // First, open the disclaimer modal.
    let disclaimerModalElement = document.getElementById('disclaimerModal');
    let disclaimerModal = new bootstrap.Modal(disclaimerModalElement);
    disclaimerModal.show();

    let modalBody = disclaimerModalElement.querySelector('.modal-body');
    let acceptButton = document.getElementById('acceptDisclaimer');

    // Reset the button to disabled state every time the modal is shown.
    acceptButton.disabled = true;

    modalBody.addEventListener('scroll', function() {
        if (modalBody.scrollHeight - modalBody.scrollTop === modalBody.clientHeight) {
            acceptButton.disabled = false;
        }
    });

    // Attach an event listener to the Accept & Classify button in the modal.
    acceptButton.addEventListener('click', async function() {
        sessionStorage.setItem('acceptedTerms', 'true'); // Store acceptance in session storage
        disclaimerModal.hide(); // Hide the modal
        await proceedWithClassification(); // Continue with the classification after the user has accepted
    });
}

async function proceedWithClassification() {
    const resultElement = document.getElementById('result');
    const loadingBarContainer = document.getElementById('loading-bar-container');
    const loadingBar = document.getElementById('loading-bar');
    
    // Set the initial message
    resultElement.textContent = "Classification Result: Classifying...";

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
            if (result.prediction.toLowerCase() === "hazardous") {
                resultElement.innerHTML = 'The image is likely <span class="hazardous-text" style="color:#FF1E00;">hazardous</span>. However, always use personal judgment when interpreting results.';
                const disposeElement = document.getElementById('hero-section');
                disposeElement.scrollIntoView({ behavior: 'smooth' });
            } else if (result.prediction.toLowerCase() === "non-hazardous") {
                resultElement.innerHTML = 'The image is likely <span class="non-hazardous-text" style="color:#f5f5f5;">non-hazardous</span>. However, always use personal judgment when interpreting results.';
            }            

            // Reset loading bar
            loadingBarContainer.style.display = "none";
            loadingBar.style.animation = "none";
            loadingBar.style.width = "0";
        }, 3000);

    } catch (error) {
        console.error("Error during image classification:", error);
        resultElement.textContent = `${error.message}`;

        // Reset loading bar
        loadingBarContainer.style.display = "none";
        loadingBar.style.animation = "none";
        loadingBar.style.width = "0";
    }
}
