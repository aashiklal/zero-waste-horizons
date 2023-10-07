document.addEventListener("DOMContentLoaded", function() {
    let currentLocation = window.location.pathname.split('/').pop();
    if(currentLocation === '')
    {
        currentLocation = 'index';
    }

    let navLinks = document.querySelectorAll(".navbar-nav .nav-link");

    navLinks.forEach(link => {
        if (link.getAttribute("href").split('/').pop() === currentLocation) {
            link.classList.add("nav-item-active");
        }
    });
});
