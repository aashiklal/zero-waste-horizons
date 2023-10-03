let model;

async function loadModel() {
    model = await tf.loadLayersModel("https://fullmoon.azurewebsites.net/api/model/model.json")
}

async function predict(imageData) {
    const tensor = tf.browser.fromPixels(imageData, 3);
    const resized = tf.image.resizeBilinear(tensor, [150, 150]).toFloat();
    const normalized = resized.div(tf.scalar(255.0));
    const batched = normalized.expandDims(0);

    const prediction = model.predict(batched);
    const isRecyclable = prediction.dataSync()[0] > 0.5;

    tensor.dispose();
    resized.dispose();
    normalized.dispose();
    batched.dispose();

    return isRecyclable ? 'Recyclable' : 'Organic';
}

// 使用
loadModel()

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
    
    // const formData = new FormData();
    // formData.append('image', input.files[0]);

    // const response = await fetch('/api/classify', {
    //     method: 'POST',
    //     body: formData
    // });

    // const result = await response.json();
    const image = new Image();
    image.src = URL.createObjectURL(input.files[0]);
    image.onload = async function() {
        try {
            const res = await predict(image); // 注意，我们在这里传递的是图像对象，而不是文件对象
            console.log(res);

            resultElement.classList.remove("dotsAnimation");
            resultElement.textContent = `Classification Result: ${res}`;
    
            // Reset loading bar
            loadingBarContainer.style.display = "none";
            loadingBar.style.animation = "none";
            loadingBar.style.width = "0";
        } catch (error) {
            console.error("Prediction error:", error);
        }
    
        // Release memory. Important to avoid memory leaks.
        URL.revokeObjectURL(image.src);


    }
    
}