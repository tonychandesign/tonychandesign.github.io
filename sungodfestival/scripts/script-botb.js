 $(document).ready(function(){
   //Gets the contestants and puts them into an array
   var contestants = $(".botb-contestent").toArray();
   
   //Prints them out in a random order
   while(contestants.length > 0) {
     //Getting a random index number from array length
     var index = Math.floor(Math.random() * (contestants.length));
     //Removing one element of array
     var shuffled_contestants = contestants.splice(index, 1);
     $('.botb-contestants-wrapper').append(shuffled_contestants[0]);
   }
 });
