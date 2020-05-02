// if darkmode is false remove wire images, remove animations and nav transition
console.log(localStorage.getItem("darkMode"));
if (localStorage.getItem("darkMode") === "false") {
  // local storage converts bool to strings
  $("#darkWire").remove();

  // remove all animation classes
  $(".animated").removeClass("animated");
  $(".dark-to-light").removeClass("dark-to-light");
  $(".slideNavIn").removeClass("slideNavIn");
  $(".fadeIn").removeClass("fadeIn");
  $(".animatedDelay").removeClass("animatedDelay");
  $(".fadeIn").removeClass("fadeIn");
}
// set darkmode to false since this js file is only called in light mode pages
localStorage.setItem("darkMode", "false");
