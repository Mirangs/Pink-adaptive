var header = document.querySelector(".main-header");
var menuToggle = document.querySelector(".page-header__toggle");
var menu = document.querySelector(".main-nav");

menuToggle.addEventListener("click", function(e) {
  e.preventDefault();
  if(menuToggle.classList.contains("page-header__toggle--open") && menu.classList.contains("main-nav--closed")) {
    header.classList.remove("main-header--closed");
    header.classList.add("main-header--opened");
    menu.classList.remove("main-nav--closed");
    menu.classList.add("main-nav--opened");
    menuToggle.classList.remove("page-header__toggle--open");
    menuToggle.classList.add("page-header__toggle--close");
  } else {
    header.classList.add("main-header--closed");
    header.classList.remove("main-header--opened");
    menu.classList.add("main-nav--closed");
    menu.classList.remove("main-nav--opened");
    menuToggle.classList.add("page-header__toggle--open");
    menuToggle.classList.remove("page-header__toggle--close");
  }
});
