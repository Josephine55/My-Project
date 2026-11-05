// Fade-in animation when page loads
document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".service-card");

    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add("show");
        }, index * 200);
    });
});