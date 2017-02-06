'use strict';

//manipulate dom

(function () {
  
   var viewChart = document.querySelector('#viewChart');
   var viewHead = document.querySelector('#viewHead');
   var pollSelection = document.querySelector('#pollSelection');
   var homeButton = document.querySelector('#home');
   var pollsButton = document.querySelector('#polls');
   var loginButton = document.querySelector('#login');
   var logoutButton = document.querySelector('#logout');
   var pollDiv = document.querySelector("#pollView");
   var authApiUrl = appUrl + '/api/:id/polls';
   var apiUrl = appUrl + '/api/polls';
   
   //used to populate polls in any polls-view
   function getPolls (data) {
      var polls = JSON.parse(data);
      //return polls;
      var innerHtml = ""
      polls.forEach(function(pol, ind){
          if (pol.name){
            var html = "<a href= /polls/" +pol.name + "><div class='poll-link'>" + pol.name + " by: " + pol.author + "</div></a>";
            innerHtml += html;
         }
      })
      
      pollDiv.innerHTML=innerHtml;
   }
   
   function displayPoll(data){
      var poll = JSON.parse(data);
      var options = poll.options[1];
      pollSelection.innerHTML = "<option value="+ options.name + ">" + options.name +"</option>";
      viewChart.innerHTML = options.name;
      viewHead.innerHTML = options.name;
      
   };
   
    
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, getPolls));
   
   var pollLink = document.querySelector('.poll-link');
    console.log(pollLink);
    
var classname = document.getElementsByClassName("poll-link");
console.log(classname);

var myFunction = function(){
      var href = this.getAttribute("href");
      console.log(href)
      ajaxFunctions.ajaxRequest('GET', appUrl + "/api" + href, displayPoll);
   };

for (var i = 0; i < classname.length; i++) {
    classname[i].addEventListener('click', myFunction, false);
}

   //pollLink.addEventListener('click', , false);
   
   pollsButton.addEventListener('mouseover', function () {
      var pollContainer = document.getElementsByClassName("polls display");
       pollDiv.style.display= pollContainer.length===0? "block" : "none";
       pollDiv.className= pollContainer.length===0? "polls display" : "polls";
   }, false);

  
})();