const menu = document.getElementById("menu-list")
document.getElementById("menu-btn").addEventListener("click", e => {
  e.preventDefault()
  menu.classList.add("active");
});

document.getElementById("close-btn").addEventListener("click", e => {
  e.preventDefault()
  menu.classList.remove("active");
});
