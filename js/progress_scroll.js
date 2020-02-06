$(function() {
  $(document).on("scroll resize", function() {
    var $d = $(document),
      $w = $(window);
    $("div#scroll-bar").width(
      ($w.scrollTop() / ($d.height() - $w.height())) * 1650
    );
    // Update the width of the progress bar
    var thanksTop =
      $(".END").offset().top -
      window.innerHeight * 0.8 -
      $(".START").offset().top;
    var progressBarTop =
      $("#scroll-bar").offset().top - $(".START").offset().top;
    var percentage = (progressBarTop / thanksTop) * 100;
    $("#scroll-bar").css("width", percentage + "vw");
  });
});
