module.exports = function pollPage (req, res){
    var pollId = req.params.id || "Polls";
    var moreOptions = req.user ? "" : null; //more options button
    var log, singUp, options;
    
    
    
    function getOptions(data){
            var poll = JSON.parse(data);
            var innerHtml = "<option value='' disabled selected hidden>Select Whom to vote for...</option>";
            options = Array(poll.options);
            
            options.forEach(function(pol, ind){
                    var html = "<option value="+ pol+ ">" + pol +"</option>";
                    innerHtml += html;
            })
      
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
                "href='http://fonts.googleapis.com/css?family=Roboto:400,500' rel='stylesheet' type='text/css'>"+
                "<link href='/public/css/main.css' rel='stylesheet' type='text/css'></head>",
        htmlOpen = "html",
        htmlClose = "</html",
        bodyOpen = "<body>",
        bodyClose = '</body>',
        header = '<div class="header"><div class="title"><img src="https://github.com/obinnaeye/images/blob/master/votebanner.png?raw=true">'+
                '</div><div class="header-tools"><button id="home">Home</button><button id="about">About</button><button id="login">'+log+'</button>'+
                 '<button id="singup">'+ singUp +'</button></div></div>',
        pollContainer = '<div class="poll-container"><h3 class="poll-header">Available Polls</h3><div class="poll-main"><div class="poll-pane">'+
                '<h3 class="poll-pane-head">Polls</h3><div class="poll-pane-polls" id="pollView"></div></div><div class="poll-view">'+
                '<h4 class="poll-view-head" id="viewHead">The Name of Poll as created by the user</h4>' +
                '<select name="candidates" required class="poll-selection" id="pollSelection">'+
                '<option value="" disabled selected hidden>Select Whom to vote for...</option><option value="King">King</option>'+
                '<option value="saab">Saab</option><option value="fiat">Fiat</option><option value="audi">Audi</option>'+
                '</select><input type="submit"><div class="poll-view-chart" id="viewChart"></div></div></div></div>',
        scripts = '<script type="text/javascript" src="/common/ajax-functions.js"></script>'+
                '<script type="text/javascript" src="/controllers/navController.polls.js"></script>';
        
                
        //use function to populate the options.
        
        fullPage = htmlOpen + head +header+ bodyOpen + pollContainer + bodyClose + scripts + htmlClose;
        res.send(fullPage);
}