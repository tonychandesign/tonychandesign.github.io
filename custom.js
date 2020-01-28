// var menu_pageid = 0;
$(function() {
  // Check for slide on new load
  // specifically it loads designated carousel item when navigating from proj page
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

  var prevScrollpos = window.pageYOffset;
  window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos >= currentScrollPos) {
      document.getElementById("navbar").style.top = "0";
    } else {
      // mobile edge case
      if (window.innerWidth < 450) {
        document.getElementById("navbar").style.top = "-160px";
      } else {
        document.getElementById("navbar").style.top = "-130px";
      }
    }
    prevScrollpos = currentScrollPos;
  };

  // Carousel JS scrolling implemented onto click action move-slide
  $(".move-slide").on("click touchend", function(e) {
    // touchend fixes the double click bug on ios safari
    e.preventDefault();

    var link = $(e.target);
    scrolltop = $(document).scrollTop(); // by this we get the value of the scrolltop ie how much scroll has been done by user
    if (parseInt(scrolltop) >= 100) {
      // check if the scroll value is equal to the top of navigation
      // Scroll to top function when clicking navbar item
      $("html, body").animate({ scrollTop: 0 });

      setTimeout(function() {
        // delayed carousel shift
        carousel.carousel(link.data("id"));
        var active = $(".navbar-nav .active ");
        active.toggleClass("active");
        link.parent().toggleClass("active");
      }, 400); //.4 sec delay
    } else {
      // no delay
      carousel.carousel(link.data("id"));
      var active = $(".navbar-nav .active ");
      active.toggleClass("active ");
      link.parent().toggleClass("active ");
    }
  });
});
