'use strict';

//manipulate dom

(function () {
  
   
   var loginButton = document.querySelector('#login') || null;
   var logoutButton = document.querySelector('#logout') || null;
   

   //pollLink.addEventListener('click', , false);
   
   if (loginButton){
      loginButton.addEventListener('click', function () {
        ajaxFunctions.ajaxRequest('GET', appUrl + "/api/session?pathUrl=" + window.location, function(data){});
      }, false);
   }
   
   if (logoutButton){
      logoutButton.addEventListener('click', function () {
        ajaxFunctions.ajaxRequest('GET', appUrl + "/api/session?pathUrl=" + window.location, function(data){
           if(data === window.location.href){
              window.location.href = appUrl + "/user/logout";
           }
        });
      }, false);
   }

  
})();