
const hamburger = document.getElementById("hambar");
const nav = document.getElementById("hamnav");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  nav.classList.toggle("active");
});
