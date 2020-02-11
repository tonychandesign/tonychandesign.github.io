$('body').css({ overflow: "hidden"});
$(window).on('load', function(){
  setTimeout(removeLoader, 1000); //wait for page load PLUS two seconds.
});
function removeLoader(){
    $( "#loadingDiv" ).fadeOut(500, function() {
      // fadeOut complete. Remove the loading div
      $('body').css({ overflow: ""});
      $( "#loadingDiv" ).remove(); //makes page more lightweight 
  });  
}