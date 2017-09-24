// var menu_pageid = 0;
$(function(){    // this is the shorthand for document.ready

  // fade out animation
  $('body').removeClass('fade-out');

  // Check for slide on new load
  // specifically it loads designated carousel item when navigating from proj page
  var query = window.location.search;
  var page_id = query.substring(query.length - 1);
  var carousel = $('#carousel');

  if (!isNaN(parseInt(page_id))){
    carousel.carousel(parseInt(page_id));

    // get active page
    var active = $('.navbar-nav .active ');
    var a_id = active.data('id');

    // if not, remove active, add to ap
    if (a_id != page_id) {
      active.toggleClass('active');
      $('.navbar-nav [data-id="'+ page_id +'"]').parent('li').toggleClass('active');
    }
  } else {
    var defaultActive = $('.navbar-nav [data-id="0"]').parent('li');
    if (!defaultActive.hasClass('active')) {
      defaultActive.toggleClass('active');
    }
  }

  // SEMI STICKY NAVBAR
  $(document).scroll(function(){    // this is the scroll event for the document
    scrolltop = $(document).scrollTop(); // by this we get the value of the scrolltop ie how much scroll has been don by user
    if(parseInt(scrolltop) >= 60) {   // check if the scroll value is equal to the top of navigation
        $("#navbar").css({"position":"fixed","top":"0"});   // is yes then make the position fixed to top 0
      }
    else {
      $("#navbar").css({"position":"absolute","top":"60px"}); // if no then make the position to absolute and set it to 80
    }
  })

  // Carousel JS scrolling implemented onto click action move-slide
  $('.move-slide').on('click touchend', function(e) {
    // touchend fixes the double click bug on ios safari
    e.preventDefault();

    var link = $(e.target);
    scrolltop = $(document).scrollTop(); // by this we get the value of the scrolltop ie how much scroll has been done by user
    if(parseInt(scrolltop) >= 100)    // check if the scroll value is equal to the top of navigation
    {
      // Scroll to top function when clicking navbar item
      $('html, body').animate({ scrollTop:(0)});

      setTimeout(function() {
        // delayed carousel shift
        carousel.carousel(link.data('id'));
        var active = $('.navbar-nav .active ');
        active.toggleClass('active');
        link.parent().toggleClass('active');
      }, 400); //.4 sec delay
    } else {
      // no delay
      carousel.carousel(link.data('id'));
      var active = $('.navbar-nav .active ');
      active.toggleClass('active ');
      link.parent().toggleClass('active ');
    }
  });


  (function($) {
  $.fn.visible = function(partial) {
      var $t            = $(this),
          $w            = $(window),
          viewTop       = $w.scrollTop(),
          viewBottom    = viewTop + $w.height(),
          _top          = $t.offset().top,
          _bottom       = _top + $t.height(),
          compareTop    = partial === true ? _bottom : _top,
          compareBottom = partial === true ? _top : _bottom;
    return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
  };
  })(jQuery);

  var win = $(window);
  var allMods = $(".module");
  allMods.each(function(i, el) {
    var el = $(el);
    if (el.visible(true)) {
      el.addClass("already-visible");
    }
  });

  win.scroll(function(event) {

    allMods.each(function(i, el) {
      var el = $(el);
      if (el.visible(true)) {
        el.addClass("come-in");
      }
    });
  });
}); // end of document.ready

// Typewriter animation
document.addEventListener('DOMContentLoaded',function(event){
  // array with texts to type in typewriter
  var dataText = [ "Hi.", "I'm Tony.", "I am a designer & developer w/ startup experience in creating elegant, engaging and functional interfaces.", "Check out some of my work below."];

  // typewriter intro effect
  // keeps calling itself until the text is finished
  function typeWriter(text, i, fnCallback) {
    // chekc if text isn't finished yet
    if (i < (text.length)) {
      // add next character to h1
     document.querySelector("h3").innerHTML = text.substring(0, i+1) +'<span aria-hidden="true"></span>';

      // wait for a while and call this function again for next character
      setTimeout(function() {
        typeWriter(text, i + 1, fnCallback)
      }, 50);
    }
    // text finished, call callback if there is a callback function
    else if (typeof fnCallback == 'function') {
      // call callback after timeout
      setTimeout(fnCallback, 1700);
    }
  }
  // start a typewriter animation for a text in the dataText array
  function StartTextAnimation(i) {
    if (typeof dataText[i] == 'undefined'){
      setTimeout(function() {
        StartTextAnimation(0);
      }, 40000);
    }
    // check if dataText[i] exists
    try {
      if (i < dataText[i].length) {
        // text exists! start typewriter animation
        typeWriter(dataText[i], 0, function(){
          // after callback (and whole text has been animated), start next text
          StartTextAnimation(i + 1);
        });
      }
    }
    catch(e) {} //clears console error
  }
  // start the text animation
  StartTextAnimation(0);
});
