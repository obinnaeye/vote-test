module.exports = function pollPage (req, res){
    var pollId = req.params.id || "Polls";
    var log, singUp, options;
    
    
    
    function getOptions(data){
            var poll = JSON.parse(data);
            var innerHtml = "<option value='' disabled selected hidden>Select Whom to vote for...</option>";
            options = Array(poll.options);
            
            options.forEach(function(pol, ind){
                    var html = "<option value="+ pol+ ">" + pol +"</option>";
                    innerHtml += html;
            })
            
            if (req.isAuthenticated()){
                innerHtml += '<option value="new">Add Your Own Option</option>';
            }
      
      return innerHtml;
    }
    
    //ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, getOptions()));
    
    if (req.isAuthenticated()){
            log = "Log Out";
            singUp = "Profile";
    }
    else{
            log = "Log In";
            singUp = "Sign Up";
    }
    
    
    var fullPage = "";
    
    var head = "<head><title>"+pollId+"</title><link" +
                'href="https://fonts.googleapis.com/css?family=Cabin+Sketch|Josefin+Slab|Khand|Marck+Script|Monoton|Poiret+One|Rajdhani|Special+Elite|VT323" rel="stylesheet">'+
                "<link href='/public/css/main.css' rel='stylesheet' type='text/css'></head>"+
                '<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>',
        htmlOpen = "<html>",
        htmlClose = "</html>",
        bodyOpen = "<body>",
        bodyClose = '</body>',
        header = '<div class="header"><div class="title"><img src="https://github.com/obinnaeye/images/blob/master/votebanner.png?raw=true">'+
                '</div><div class="header-tools"><button id="home">Home</button><button id="about">About</button><button id="login">'+log+'</button>'+
                 '<button id="singup">'+ singUp +'</button></div></div>',
        pollContainer = '<div class="poll-container"><div class="poll-main"><div class="poll-view vote-only">'+
                        '<div class="poll-view-head" id="pollViewHead">The Name of Poll as created by the user</div>'+
                        '<div class="poll-view-body"><div class="poll-view-selection"><p class="poll-view-desc">'+
                        'I want tht description to be here and nothing more than that.</p>'+
                        '<select name="candidates" required class="poll-selection" id = "pollSelection">'+
                        '<option value="" disabled selected hidden>Select Whom to vote for...</option></select><br>'+
                        '<input type="submit" class="submit-vote" value="VOTE" id="submitVote"></div>'+
                        '<div class="poll-view-chartArea">'+
                        '<div class="poll-view-chartTitle" id="chartTitle">The Title Of the Chart</div>'+
                        '<div class="poll-view-chart" id="chart"></div></div></div></div></div>'+
                        '<div class="add-option" id="newOption"><div class="new-option">'+
                        'New Option: <input type="text" placeholder="Type your own option here." id="newOptionValue">'+
                        '</div><div id="optionWarning"></div><div class="new-option-btns">'+
                        '<input type="submit" value="Vote" id="newOptionOk">'+
                        '<input type="submit" value="Cancel" id="newOptionCancel"></div></div></div>',
        scripts = '<script type="text/javascript" src="/common/ajax-functions.js"></script>'+
                '<script type="text/javascript" src="/controllers/pollLinkCont.client.js"></script>';
        
                
        //use function to populate the options.
        
        fullPage = htmlOpen + head + bodyOpen + header + pollContainer + scripts + bodyClose + htmlClose;
        res.send(fullPage);
}