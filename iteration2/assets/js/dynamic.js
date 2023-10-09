let start = 0;
const final = 53;
let interval;

function animation() {
    interval = setInterval(() => {
        if (start < final) {
            start++;
            document.getElementById("dynamicNumber").innerText = `${start}%`;
        } else {
            clearInterval(interval);
        }
    }, 50);
}
//when the element shows in the window, start animation
document.addEventListener("scroll", function() {
    const rect = document.getElementById("dynamicNumber").getBoundingClientRect();

    if (rect.top >= 0 && rect.bottom <= window.innerHeight && !interval) { 
        animation();
    }
});
