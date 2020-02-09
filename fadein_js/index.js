/*Interactivity to determine when an animated element in in view. In view elements trigger our animation*/
$(document).ready(function() {
  //window and animation items
  var animation_elements = $.find(".animation-element");
  var navBG = $.find(".navbar-expand");
  var warpedHeader = $.find(".content");
  var web_window = $(window);

  //check to see if any animation containers are currently in view
  function check_if_in_view() {
    //get current window information
    var window_height = web_window.height();
    var window_top_position = web_window.scrollTop();
    var window_bottom_position = window_top_position + window_height;

    //iterate through elements to see if its in view
    $.each(animation_elements, function() {
      //get the elements information
      var element = $(this);
      var element_height = $(element).outerHeight();
      var element_top_position = $(element).offset().top + 100;
      var element_bottom_position = element_top_position + element_height;

      //check to see if this current container is visible (its viewable if it exists between the viewable space of the viewport)
      if (
        element_bottom_position >= window_top_position &&
        element_top_position <= window_bottom_position
      ) {
        element.addClass("in-view");
      }
    });

    // disable scroll listener if on resume or about me section
    var active = $(".navbar-nav .active ");
    if (active.hasClass("navAbout") || active.hasClass("navResume")) {
      return;
    }
    // make nav background transparent so text inverts colors
    var element = $(warpedHeader);
    var ele_h = $(element).outerHeight();
    var ele_t = $(element).offset().top + 100;
    var ele_bot = ele_t + ele_h - 300;
    if (ele_bot >= window_top_position && ele_t <= window_bottom_position) {
      $(navBG).removeClass("whiteNav");
      $(navBG).addClass("transNav");
      $(".nav-item").addClass("whiteText");
      $(".tonychan").addClass("whiteText");
    } else {
      $(navBG).addClass("whiteNav");
      $(navBG).removeClass("transNav");
      $(".nav-item").removeClass("whiteText");
      $(".tonychan").removeClass("whiteText");
    }
  }

  //on or scroll, detect elements in view
  $(window).on("scroll resize", function() {
    check_if_in_view();
  });
  //trigger our scroll event on initial load
  $(window).trigger("scroll");
});
