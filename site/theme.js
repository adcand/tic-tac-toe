const page = document.querySelector(".body");
const themeButton = document.querySelector(".theme-button");

themeButton.addEventListener("click", changeTheme);

function changeTheme() {
  page.classList.toggle("darkmode");
}