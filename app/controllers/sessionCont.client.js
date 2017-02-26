'use strict';

//manipulate dom

(function () {
  //using ready function so that buttons may be available for dynamically added pages; 
  // eg /:username/polls/:id
   ajaxFunctions.ready(addButtons)
   
   var loginButton, logoutButton;
   
   function addButtons(){
       loginButton = document.querySelector('#login') || null;
       logoutButton = document.querySelector('#logout') || null;
   
       if (loginButton){
          loginButton.addEventListener('click', function () {
              console.log(window.location);
            ajaxFunctions.ajaxRequest('GET', appUrl + "/api/session?pathUrl=" + window.location.href, function(data){});
          }, false);
       }
       
       if (logoutButton){
          logoutButton.addEventListener('click', function () {
            ajaxFunctions.ajaxRequest('GET', appUrl + "/api/session?pathUrl=" + window.location.href, function(data){
               if(data === window.location.href){
                  window.location.href = appUrl + "/user/logout";
               }
            });
          }, false);
       }
   }
  
})();