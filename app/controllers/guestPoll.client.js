
//var appUrl = window.location.origin;

(function () {
//set the semi-global variables here
var pollID = "";
var pollClick = "";
var status = "";
var globalPoll;

var chartOptions = {
      'width':650,
      'chartArea':{width:'70%',height:'70%', left:"25%", top: 50},
      'backgroundColor' : {fill: '#F2F3F4'},
      'colors':['#512E5F','#F5B041', '#641E16', '#F39C12', '#C39BD3', '#17202A', '#0B5345'],
      'height':400};

google.charts.setOnLoadCallback(loadPolls);
google.charts.setOnLoadCallback(updateChart);


//use replacer function to deal with spaces in stringify 
  //to be used as poll attribute
function replacer(key, value) {
    // Filtering out properties
    if (typeof value === 'string') {
        var arr = value.split(" ");
        var str = arr.join("---");
        return str;
    }
    return value;
 }


//use reviver to remove "---" added in stringify
function reviver(key, value){
    
    if (typeof value === "string"){
      var str = value.replace(/---/g, " ");
      return str;
    }
    return value
  }

function addEventToClass (klass){
  //add click event to each of the polls in the pane
    for (var i=0; i<klass.length; i++){
      var pollClass = klass[i];
      pollClass.addEventListener('click', openPoll, false);
    }
}

//draw chart if there are vote, else display a message
function conditionalDraw(counter, data, options){
  if (counter === 0){
    document.getElementById('chart').innerHTML = "<div rel='no-chart'>This poll has no votes yet. Be the first to vote!</div>"
  }
  else{
    document.getElementById('chart').innerHTML = "";
    // Instantiate and draw the chart.    
   var chart = new google.visualization.PieChart(document.getElementById('chart'));
   chart.draw(data, options);
  }
}

function loadPolls (result){
    var poll = JSON.parse(result);
    globalPoll = poll;
    var pollHtml = "";
    var optionHtml = '<option value="" disabled selected hidden>Select Whom to vote for...</option>';
    
    //populate polls
    var index = poll[0].username? 1 : 0;
    var firstPoll = poll[index]; 
  
    while (index < poll.length){
      var currentPoll = poll[index],
          pollString = JSON.stringify(currentPoll, replacer);
      pollHtml += '<li class="poll-ref" id =' + currentPoll._id + ' poll=' + pollString +' >' + currentPoll.name + ':<span> by ' + currentPoll.author + '</span></li>';      
      index++;
    }  
    
    document.getElementById("poll-list").innerHTML = pollHtml;
    pollClick = document.getElementsByClassName("poll-ref");
    //add class active to the first poll in poll pane
    document.getElementsByClassName("poll-ref")[0].className = "poll-ref active";
    pollID = poll[0].username ? poll[1]._id : poll[0]._id;
    
    // Chart
   var voteOptions = poll[0].options;
   var len = voteOptions.length;
   var data = new google.visualization.DataTable();    
   data.addColumn('string', 'Name');
   data.addColumn('number', 'Votes');
    
    // Set chart options
   var options = chartOptions;
   var voteCounter = 0;
        
    while (len){
      var currentOption = voteOptions[len-1];
      data.addRow([currentOption.name, currentOption.vote]);
      optionHtml += '<option class="vote-option" value=' + currentOption._id + '>' + currentOption.name + '</option>';
      
      //check for polls with votes other than 0;
      if(currentOption.vote > 0){ voteCounter++; }
      len--;
    }
    
    document.getElementById("pollViewDesc").innerHTML = firstPoll.description;
    document.getElementById("pollViewHead").innerHTML = firstPoll.name + ':<span> by ' + firstPoll.author + '</span>';
    document.getElementById("chartTitle").innerHTML = firstPoll.name + ': Pie Chart.';
    document.getElementById("pollSelection").innerHTML = optionHtml;
    document.getElementById("pollLink").addEventListener("click", showLink, false);
    document.getElementById("linkBoxClose").addEventListener("click", closeLink, false);
    
    //add click event to each of the polls in the pane
  addEventToClass (pollClick)
  
  conditionalDraw(voteCounter, data, options);
  
  }
  
  //show link box
  function showLink(){
      document.getElementById("mask").style.display = "block";
      document.getElementById("linkBox").style.display = "block";
      var pollID = document.getElementsByClassName("poll-ref active")[0].getAttribute("id");
      document.getElementById("linkBoxLink").innerHTML = appUrl + "/username/polls/" + pollID;
  }
  
  //close link box
  function closeLink(){
      document.getElementById("mask").style.display = "none";
      document.getElementById("linkBox").style.display = "none";
  }

function updateChart(obj){
  // Chart
   var result = JSON.parse(obj);
   var voteOptions = result.options;
   var len = voteOptions.length;
    // Define the chart to be drawn.
   var data = new google.visualization.DataTable();    
   data.addColumn('string', 'Name');
   data.addColumn('number', 'Votes');   
  
  var voteCount = 0;
    while (len){
      var currentOption = voteOptions[len-1];
      data.addRow([currentOption.name, currentOption.vote]);
      
      //check if there is any vote for the option
      if (currentOption.vote > 0){voteCount++};
      len--;
    }
  
  var options = chartOptions; 
    
   
 conditionalDraw(voteCount, data, options);
 
 //Open screen here
  document.getElementById("displayBox").style.display = "none";
  document.getElementById("mask").style.display = "none";
  
  //set the 'poll' attribute of the poll to the result of an Ajax call
  //use the global status to check whether to click on poll
  
  document.getElementById(pollID).setAttribute("poll", obj);
  if(status === "new option"){
    document.getElementById(pollID).click();
    status = "";
  }
  
}

function openPoll(){
  var poll = this.getAttribute("poll");  
  
  var pollObj= JSON.parse(poll, reviver);
  document.getElementsByClassName("poll-ref active")[0].className = "poll-ref";
  this.className += " active";
  
  var voteOptions = pollObj.options,
      len = voteOptions.length;
  
  //reset current pollID
  pollID = pollObj._id;
  
  //update poll options in <select>
  var optionHtml = '<option value="" disabled selected hidden>Select Whom to vote for...</option>';
  while (len){
      var currentOption = voteOptions[len-1];      
      optionHtml += '<option class="vote-option" value=' + currentOption._id + '>' + currentOption.name + '</option>';
      len--;
    }
  
  //Add your own options if you desire
  optionHtml += '<option value="new">Add Your Own Option</option>';
  
  document.getElementById("pollViewHead").innerHTML = pollObj.name + ':<span> by ' + pollObj.author + '</span>';
  document.getElementById("pollViewDesc").innerHTML = pollObj.description;
  document.getElementById("chartTitle").innerHTML = pollObj.name + ': Pie Chart.';
  document.getElementById("pollSelection").innerHTML = optionHtml;
  //update chart with updateChart function above
  updateChart(JSON.stringify(pollObj)); 
}

function sendVote(){
  var value = document.getElementById("pollSelection").value;
  if (value){
    //lock the screen first
    document.getElementById("mask").style.display = "block";
    document.getElementById("displayBox").style.display = "block";
    ajaxFunctions.ajaxRequest('POST', appUrl + "/api/votes?voteid=" + value, updateChart)
  }
}

var submitVote = document.getElementById("submitVote");

submitVote.addEventListener('click', sendVote, false);

ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', appUrl + "/api/polls-array", loadPolls));



//Reset globalPoll variable
function updatePoll(data){
  
  var parsedData = JSON.parse(data);
  var stringData = JSON.stringify(parsedData, replacer);
  globalPoll.push(parsedData);
  var newPollList = document.getElementById("poll-list").innerHTML;
  newPollList += '<li class="poll-ref" id =' + parsedData._id + ' poll=' + stringData +' >' + parsedData.name + ':<span> by ' + parsedData.author + '</span></li>';
  
  //document.getElementById("poll-list").appendChild(newPollList)
  document.getElementById("poll-list").innerHTML = newPollList;
  pollClick = document.getElementsByClassName("poll-ref");
  addEventToClass (pollClick)
}


})();

  

