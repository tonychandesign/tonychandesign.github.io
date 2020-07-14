$(document).ready(function () {
  // if darkmode is false remove wire images, remove animations and nav transition

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
    $("body").css("background", "#f7f7f7");
  } else {
  }
  // set darkmode to false since this js file is only called in light mode pages
  localStorage.setItem("darkMode", "false");
});
