// dynamically load dark mode to fix black flicker
var header = document.getElementsByTagName("head")[0];
var styleSheet = document.createElement("link");
styleSheet.rel = "stylesheet";
styleSheet.type = "text/css";
if (localStorage.getItem("darkMode") === "false") {
  styleSheet.href = "./css/overideLight.css";
} else {
  styleSheet.href = "./css/overideDark.css";
}
styleSheet.media = "all";
header.appendChild(styleSheet);
