(function(){
    
    google.charts.setOnLoadCallback(loadPoll);
    
    var chartOptions = {
      'width':650,
      'chartArea':{width:'70%',height:'70%', left:"25%", top: 50},
      'backgroundColor' : {fill: '#F2F3F4'},
      'colors':['#512E5F','#F5B041', '#641E16', '#F39C12', '#C39BD3', '#17202A', '#0B5345'],
      'height':400};
    
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
        
        console.log(pollObj);
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
    }
    
    function vote(){
        var value = document.getElementById("pollSelection").value;
        //lock screen here
        if(value){
            document.getElementById("mask").style.display = "block";
            document.getElementById("displayBox").style.display = "block";
            ajaxFunctions.ajaxRequest('POST', appUrl + "/api/votes?voteid=" + value, update)
        }
    }
    
    
    function update(data){
        //no need to create new poll string attribute in the head, the data is a string already
        //var newPollStr = JSON.stringify(data);
        var pageHead = document.getElementsByTagName("head")[0];
        pageHead.setAttribute("poll", data);
        
        loadPoll();
        //Open screen here
        document.getElementById("displayBox").style.display = "none";
        document.getElementById("mask").style.display = "none";
    }
    
    //
    ajaxFunctions.ready(loadPoll);
    
})()

