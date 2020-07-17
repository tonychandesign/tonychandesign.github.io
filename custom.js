// handles carousel state when navigating from case study -> index
$(function () {
  // loads designated carousel item when navigating from proj page
  var query = window.location.search;
  var page_id = query.substring(query.length - 1);
  var carousel = $("#carousel");

  if (!isNaN(parseInt(page_id))) {
    carousel.carousel(parseInt(page_id));

    // get active page
    var active = $(".navbar-nav .active ");
    var a_id = active.data("id");

    // if not, remove active, add to ap
    if (a_id != page_id) {
      active.toggleClass("active");
      $('.navbar-nav [data-id="' + page_id + '"]')
        .parent("li")
        .toggleClass("active");
    }
  } else {
    var defaultActive = $('.navbar-nav [data-id="0"]').parent("li");
    if (!defaultActive.hasClass("active")) {
      defaultActive.toggleClass("active");
    }
  }

  // set which carousel page onload
  var active = $(".navbar-nav .active ");
  if (active.hasClass("navPortfolio")) {
    $("#caroOne").toggleClass("active");
  } else if (active.hasClass("navResume")) {
    $("#caroTwo").toggleClass("active");
  } else {
    $("#caroThree").toggleClass("active");
  }

  // Carousel JS scrolling implemented onto click action move-slide
  $(".move-slide").on("click touchend", function (e) {
    // touchend fixes the double click bug on ios safari
    e.preventDefault();
    var link = $(e.target);
    carousel.carousel(link.data("id"));
    var active = $(".navbar-nav .active ");
    var navBG = $.find(".navbar-expand");
    // remove active from old
    active.toggleClass("active ");
    // add active to new position
    link.parent().toggleClass("active ");
  });
});
