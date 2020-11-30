// intuit side nav becomes fixed earlier because of the other intuit work section
$(window).scroll(function () {
  if (detectmob()) {
    return;
  }
  //window and animation items
  var hideNav = $.find(".longImage");
  var web_window = $(window);

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
    } else {
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
  // side nav becomes fixed at start
  if ($(this).scrollTop() > 800) {
    $("#bar-fixed").css({ position: "fixed", top: "200px" });
  } else {
    $("#bar-fixed").css({ position: "absolute", top: "1000px" });
  }

  var scrollHeight = $(this).scrollTop() + $(window).height();
  if (scrollHeight < 3000) {
    return;
  }

  // change back to absolute at end of proj
  var _docHeight = document.body.scrollHeight;
  if ($(this).scrollTop() > 800 && scrollHeight < _docHeight - 1700) {
    $("#bar-fixed").css({ position: "fixed", top: "200px" });
  } else {
    $("#bar-fixed").css({
      position: "absolute",
      top: _docHeight - 1700 - $(window).height() + 200,
    });
  }
});

function detectmob() {
  if (window.innerWidth <= 1000 || window.innerHeight <= 600) {
    return true;
  } else {
    return false;
  }
}
