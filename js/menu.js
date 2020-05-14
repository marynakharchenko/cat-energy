const buttonMenuOpen = document.querySelector(".main-nav__toggle");
const menu = document.querySelector(".main-nav");

buttonMenuOpen.addEventListener("click", (event) => {
    event.preventDefault();
    menu.classList.toggle("hidden")

});