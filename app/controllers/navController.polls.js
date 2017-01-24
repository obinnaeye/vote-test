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
   var apiUrl = appUrl + '/api/poll';
   
   console.log(pollSelection);
   
   //used to populate polls in any polls-view
   function getPolls (data) {
      var polls = JSON.parse(data);
      //return polls;
      var innerHtml = ""
      polls.forEach(function(pol, ind){
          var html = "<a href= /polls/" +pol.name + "><div class='poll-link'>" + pol.name + " by: " + pol.author + "</div></a>";
          innerHtml += html;
      })
      
      pollDiv.innerHTML=innerHtml;
      ajaxFunctions.ajaxRequest('GET', "https://voting-test-obinnaeye.c9users.io/api/polls/one", displayPoll);
   }
   
   function displayPoll(data){
      var poll = JSON.parse(data);
      var options = poll.options;
      
      var innerHtml = "<option value='' disabled selected hidden>Select Whom to vote for...</option>";
      options.forEach(function(pol, ind){
          var html = "<option value="+ poll.options[0].name + ">" + poll.options[0].name +"</option>";
          innerHtml += html;
      })
      pollSelection.innerHTML = innerHtml;
      viewChart.innerHTML = poll.options[0].name;
      viewHead.innerHTML = poll.options[0].name;
      console.log(poll.options)
      
   };
   
    
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, getPolls));
   
   
   var pollLink = document.querySelector('.poll-link');
    //console.log(pollLink);
    
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
   
   
})();