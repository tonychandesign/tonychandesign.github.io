$(document).ready(function () {
  //window and animation items
  var hideNav = $.find(".longImage");
  var web_window = $(window);

  //check to see if any animation containers are currently in view
  function check_if_in_view() {
    //get current window information
    var window_height = web_window.height();
    var window_top_position = web_window.scrollTop();
    var window_bottom_position = window_top_position + window_height;

    //iterate through elements to see if its in view
    $.each(hideNav, function () {
      //get the elements information
      var element = $(this);
      var element_height = $(element).outerHeight();
      var element_top_position = $(element).offset().top + 500;
      var element_bottom_position = element_top_position + element_height - 600;
      //edge case for long images outside of current viewport
      if (Math.abs(element_top_position - window_top_position) > 1500) {

      }
      else {
        if (
          element_bottom_position >= window_top_position &&
          element_top_position <= window_bottom_position
        ) {
          $("#bar-fixed").addClass("in-view");
        } else {
          $("#bar-fixed").removeClass("in-view");
        }
      }

    });
  }

  //on or scroll, detect elements in view
  $(window).on("scroll resize", function () {
    check_if_in_view();
  });
  //trigger our scroll event on initial load
  $(window).trigger("scroll");
});
