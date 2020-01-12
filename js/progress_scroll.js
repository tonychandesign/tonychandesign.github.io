$(function() {
  $(document).on("scroll resize", function() {
    var $d = $(document),
      $w = $(window);
    $("div#scroll-bar").width(
      ($w.scrollTop() / ($d.height() - $w.height())) * 2000
      // ($d.scrollTop() / $d.height()) * $d.height() + "px"
    );
  });
});
