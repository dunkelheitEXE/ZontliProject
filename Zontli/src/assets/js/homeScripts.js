function action() {
    const form = document.getElementsByClassName("newAccountContainer");
    form[0].classList.toggle("inactive");
}

document.addEventListener("keydown", e => {
    const form = document.getElementsByClassName("newAccountContainer");
    form[0].classList.toggle("inactive");
});
