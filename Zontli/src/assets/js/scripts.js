document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-menu").addEventListener("click", e => {
        e.preventDefault();
        document.getElementById("offCanvas").classList.toggle("visible");
    });
});


// Function to print a page in PDF

function printPage() {
  window.print();
}

