function action() {
    const form = document.getElementsByClassName("newAccountContainer");
    form[0].classList.toggle("inactive");
}

document.addEventListener("keydown", e => {
    if (e.key == "Escape") {
        const form = document.getElementsByClassName("newAccountContainer");
        form[0].classList.toggle("inactive");
    }
});


function states(res) {
  let text = "";
  res.forEach((element) => {
    text += JSON.stringify(element) + "\n";
  });
}
