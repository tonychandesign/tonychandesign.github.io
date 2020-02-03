$(window).scroll(function() {
  if (detectmob()) {
    return;
  }
  // side nav becomes fixed at start
  if ($(this).scrollTop() > 800) {
    $("#bar-fixed").css({ position: "fixed", top: "200px" });
  } else {
    $("#bar-fixed").css({ position: "absolute", top: "1000px" });
  }

  var scrollHeight = $(this).scrollTop() + $(window).height();
  if (scrollHeight < 5000) {
    return;
  }

  // change back to absolute at end of proj
  var _docHeight = document.body.scrollHeight;
  if ($(this).scrollTop() > 800 && scrollHeight < _docHeight - 1100) {
    $("#bar-fixed").css({ position: "fixed", top: "200px" });
  } else {
    $("#bar-fixed").css({
      position: "absolute",
      top: _docHeight - 1100 - $(window).height() + 200
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
