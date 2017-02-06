'use strict';

//manipulate dom

(function () {
  
   
   var loginButton = document.querySelector('#login');
   

   //pollLink.addEventListener('click', , false);
   
   loginButton.addEventListener('click', function () {
       console.log(window.location)
     ajaxFunctions.ajaxRequest('GET', appUrl + "/api/session?pathUrl=" + window.location, function(data){});
   }, false);

  
})();