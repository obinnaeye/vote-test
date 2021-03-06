(function(){
    
    google.charts.setOnLoadCallback(loadPoll);
    
    var userVotes,
        globalCurrentPoll="";
    
    var chartOptions = {
      'width':650,
      'chartArea':{width:'70%',height:'70%', left:"25%", top: 50},
      'backgroundColor' : {fill: '#F2F3F4'},
      'colors':['#512E5F','#F5B041', '#641E16', '#F39C12', '#C39BD3', '#17202A', '#0B5345'],
      'height':400};
     
    //use reviver to remove "---" added in stringify
    function reviver(key, value){
        
        if (typeof value === "string"){
          var str = value.replace(/---/g, " ");
          return str;
        }
        return value
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
    
    //load poll here
    function loadPoll(){
        var pageHead = document.getElementsByTagName("head")[0];
        var pollStr = pageHead.getAttribute("poll");
        var pollObj = JSON.parse(pollStr, reviver);
        globalCurrentPoll = pollObj.name;
        
        // Chart
       var voteOptions = pollObj.options;
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
          
          //check for polls with votes other than 0;
          if(currentOption.vote > 0){ voteCounter++; }
            len--;
        }
        
        conditionalDraw(voteCounter, data, options);
        
        //add events here so it is called after page load
        var submitVote = document.getElementById("submitVote");
        submitVote.addEventListener('click', vote, false);
        if(document.getElementById("newOption")){
            document.getElementById("pollSelection").addEventListener('change', addOptionDisplay, false);
        }
        
        if(document.getElementById("newOptionCancel")){
            document.getElementById("newOptionCancel").addEventListener('click', cancelOption, false);
        }
        
        if(document.getElementById("newOptionOk")){
            document.getElementById("newOptionOk").addEventListener('click', newOption, false);
        }
      ajaxFunctions.ajaxRequest("GET", appUrl+ "/api/userprofile", userInfo);
    }
    
    function userInfo(data){
      if(data !== undefined){
        var authUserVotes = JSON.parse(data);
        if (authUserVotes.votes){
          userVotes = authUserVotes.votes;
        }else{
          if(!sessionStorage.getItem("linkUserVotes")){
            sessionStorage.setItem("linkUserVotes", "[]");
          }
          userVotes = JSON.parse(sessionStorage.getItem("linkUserVotes"));
        }
      }
    }
    
    function voterCheck(){
      var len = userVotes.length;
      while (len){
        var vote = userVotes[len-1];
        if(vote.pollName === globalCurrentPoll){
          return false;
        }
        len--;
      }
      return true;
    }
    
    function vote(){
        var value = document.getElementById("pollSelection").value;
        //lock screen here
        if(!voterCheck()){
          document.getElementById("mask").style.display = "block";
          document.getElementById("displayBox").innerHTML = "Sorry! You have already voted! You can't vote twice!";
          document.getElementById("displayBox").style.display = "block";
          setTimeout(function(){
          document.getElementById("mask").style.display = "none";
          document.getElementById("displayBox").innerHTML = "Submitting vote . . .";
          document.getElementById("displayBox").style.display = "none";
          }, 3000);
        }else{
          if(value){
              document.getElementById("mask").style.display = "block";
              document.getElementById("displayBox").style.display = "block";
              ajaxFunctions.ajaxRequest('POST', appUrl + "/api/votes?voteid=" + value, update);
          }
        }
    }
    
    
    function update(data){
      if(data !== undefined){
        //Update userVotes to avoid multiple votes
        //Done here because update is only called when there is vote or new option vote
        var voteObj = {pollName: globalCurrentPoll},
              oldSessionVotes = JSON.parse(sessionStorage.getItem("linkUserVotes"));
        oldSessionVotes.push(voteObj);
        sessionStorage.setItem("linkUserVotes", JSON.stringify(oldSessionVotes));
        ajaxFunctions.ajaxRequest("GET", appUrl+ "/api/userprofile", userInfo);
        //no need to create new poll string attribute in the head, the data is a string already
        //var newPollStr = JSON.stringify(data);
        var pageHead = document.getElementsByTagName("head")[0];
        pageHead.setAttribute("poll", data);
        
        //populate poll options
        var optionHtml = '<option value="" disabled selected hidden>Select Whom to vote for...</option>';
        var pollOptions= JSON.parse(data).options;
        pollOptions.forEach(function(pol, ind){
                        var html = "<option value="+ pol._id + ">" + pol.name +"</option>";
                        optionHtml += html;
                });
        var optionPresent = document.getElementById("pollSelection").lastChild.value;
        if(optionPresent === "..."){
          optionHtml += '<option value="...">Add Your Own Option</option>';
        }
        document.getElementById("pollSelection").innerHTML = optionHtml;
        
        loadPoll();
        //Open screen here
        document.getElementById("displayBox").style.display = "none";
        document.getElementById("mask").style.display = "none";
      }
    }
    
    //Add your own option function
    function addOptionDisplay(){
      var value = document.getElementById("pollSelection").value;  
      if(value === "..."){
        document.getElementById("newOption").style.display = "block";
      }
    }
    
    //Cancel new option window;
    function cancelOption(){
      document.getElementById("newOption").style.display = "none";
      document.getElementById("pollSelection").value = "";
      document.getElementById("newOptionValue").value = "";
      document.getElementById("optionWarning").innerHTML = "";
    }
    
    
    //Add new option
    function newOption(){
      var newOption = document.getElementById("newOptionValue").value;  
      var pageHead = document.getElementsByTagName("head")[0],
          pollStr = pageHead.getAttribute("poll"),
          pollObj = JSON.parse(pollStr, reviver),
          options = pollObj.options,
          pollID = pollObj._id;
      var filtered = options.filter(function(value){return value.name.toLocaleLowerCase() === newOption.toLocaleLowerCase()});
      
      if(filtered.length >= 1){
        document.getElementById("optionWarning").innerHTML = "This option already exists. Cancel or enter a new option!";
      }else if(newOption === ""){
        document.getElementById("optionWarning").innerHTML = "You have not entered any option!";
      }
      else{
        newOption = newOption.slice(0, 1).toUpperCase() + newOption.slice(1);
        document.getElementById("newOption").style.display = "none";
        document.getElementById("displayBox").style.display = "block";
        document.getElementById("mask").style.display = "block";
        
        ajaxFunctions.ajaxRequest('POST', appUrl + "/api/newoption?pollid=" + pollID + "&option=" + newOption, update);    
        //document.getElementById("pollSelection").value = "";
        document.getElementById("newOptionValue").value = "";
        document.getElementById("optionWarning").innerHTML = "";
      }  
    }
    //
    ajaxFunctions.ready(loadPoll);
    
})()

