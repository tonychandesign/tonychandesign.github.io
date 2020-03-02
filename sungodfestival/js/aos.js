AOS.init();

window.addEventListener('load', function() {
  AOS.refresh();
});

// $(window).on('load', function() {
//     AOS.refresh();
// });

// init = [];
// x = setInterval(function() {
//     init.push(AOS.init());
//     if (init.length >= 2) {
//          clearInterval(x);
//     }
// }, 1);

window.addEventListener('load', AOS.refresh);
