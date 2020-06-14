// target different element on hover
$(function () {
  $("#hoverOn1, .box3").hover(
    function () {
      $("#hoverTargetBG1").css("background-color", "rgba(0, 0, 0, 0.9)");
      $("#hoverTargetText1").css("opacity", "1");
    },
    function () {
      // on mouseout, reset the background colour
      $("#hoverTargetBG1").css("background-color", "rgba(0, 0, 0, 0)");
      $("#hoverTargetText1").css("opacity", "0");
    }
  );

  $("#hoverOn2, .box3").hover(
    function () {
      $("#hoverTargetBG2").css("background-color", "rgba(0, 0, 0, 0.9)");
      $("#hoverTargetText2").css("opacity", "1");
    },
    function () {
      // on mouseout, reset the background colour
      $("#hoverTargetBG2").css("background-color", "rgba(0, 0, 0, 0)");
      $("#hoverTargetText2").css("opacity", "0");
    }
  );
});
