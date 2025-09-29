document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-menu").addEventListener("click", e => {
        e.preventDefault();
        document.getElementById("offCanvas").classList.toggle("visible");
    });
});