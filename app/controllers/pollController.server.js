'use strict';
//var Users = require('../models/users.js');
var Polls = require('../models/polls.js');
var path = process.cwd();

function PollHandler () {
    
    function userCheck(request, response, data){
        
                if (request.isAuthenticated()){
                    data.unshift({username : request.user.github.username});
                    console.log(request.user.github.username);
                    response.json(data);
                }
                else {
                    response.json(data);
                }
    }

     //create get polls here
    this.getPolls = function (req, res) {
        
        Polls
            .find({})
            .exec(function (err, result) {
                if (err) { throw "No such data"; }
                res.json(result);
            });
    };
    
    //create get polls here
    this.getOnePoll = function (req, res) {
        Polls
            .findOne({_id:req.query.id})
            .exec(function (err, result) {
                if (err) { throw err; }
                userCheck(req, res, result);
            });
    };
    
    //polls view by id
    this.pollPage = function pollPage (req, res){
    var pollId = req.params.id || "Polls";
    var username = req.params.username;
    var moreOptions = req.user ? "" : null; //more options button
    var log, singUp, options;
    
    
    
    
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
        logHref = req.isAuthenticated() ? "/user/logout" : "/guest/login",
        signupHref = req.isAuthenticated() ? "/" + req.user.github.username + "/profile" : "/guest/signup",
        header = '<div class="header"><div class="title"><img src="https://github.com/obinnaeye/images/blob/master/votebanner.png?raw=true">'+
                '</div><div class="header-tools"><a href="/"><button id="home">Home</button></a><a href="/:username/about"><button id="about">About</button>'+
                '<a href=' + logHref + '><button id="login">'+log+'</button></a>'+
                 '<a href=' + signupHref + '><button id="singup">'+ singUp +'</button></a></div></div>',
        pollContainer = '<div class="poll-container"><h3 class="poll-header">Available Polls</h3><div class="poll-main"><div class="poll-pane">'+
                '<h3 class="poll-pane-head">Polls</h3><div class="poll-pane-polls" id="pollView">', //polls here
        pollView = '</div></div><div class="poll-view">'+
                '<h4 class="poll-view-head" id="viewHead">The Name of Poll as created by the user</h4>',
        selection = '<select name="candidates" required class="poll-selection" id="pollSelection">',
                
        selection2 ='</select><input type="submit"><div class="poll-view-chart" id="viewChart"></div></div></div></div>',
        scripts = '<script src="https://www.gstatic.com/charts/loader.js"></script>'+
                '<script type="text/javascript" src="/common/ajax-functions.js"></script>'+
                '<script type="text/javascript" src="/controllers/navController.polls.js"></script>';
        
                
        //use function to populate the options.
        
        fullPage = htmlOpen + head +header+ bodyOpen + pollContainer + selection + bodyClose + htmlClose;
        //console.log(getOptions());
        
        function resultFilter(data){
            return data.filter(function(el){return el._id == pollId;});//
        }
        
        var opt = [];
        var optionHtml = "<option value='' disabled selected hidden>Select Whom to vote for...</option>";
        Polls.find({})
            .exec(function (err, result) {
                var optionArr = resultFilter(result);
                //result = JSON.parse(result);
                if (err) {
                    console.log("Error");
                    res.redirect("/guest/polls");
                }else if (!result){
                    console.log("No result");
                    res.redirect("/guest/polls");
                }else if (optionArr.length === 0){
                    console.log("No Id");
                    res.redirect("/guest/polls");
                }else{
                    opt = optionArr[0].options;
                    opt.forEach(function(candidates, ind){
                        var html = "<option value="+ candidates.name + ">" + candidates.name +"</option>";
                        optionHtml += html;
                    });
                    
                    var pollHtml = "";
                    result.forEach(function(pol, ind){
                        if (pol.name){
                            var html = "<a href= /polls/" +pol._id + " id=" + pol._id + "><div class='poll-link'>" + pol.name + " by: " + pol.author + "</div></a>";
                            pollHtml += html;
                        }
                    });
                    
                    fullPage = htmlOpen + head +header+ bodyOpen + pollContainer + pollHtml + pollView + selection + optionHtml + selection2 + bodyClose + htmlClose;
                    if (req.isAuthenticated()){
                        if (req.user.github.username === username){
                            res.send(fullPage);
                        }else{
                            res.redirect("/" + req.user.github.username + "/polls/" + pollId);
                        }
                    }
                    else {
                        if (username === "guest"){
                            res.send(fullPage);
                        }else{
                            res.redirect("/guest/polls/" + pollId);
                        }
                    }
                    
                }
            });
};
    
    //create get polls here
    this.getVotes = function (req, res) {
        Polls
            .findOne({name:req.query.name}, { '_id': false })
            .exec(function (err, result) {
                if (err) { throw err; }
                userCheck(req, res, result);
            });
    };
    
    
    //add polls here
    this.addPoll = function (req, res) {
        var optionString = req.query.options;
        var optionArr1 = optionString.split(",");
        var desc = req.query.desc;
        var len = optionArr1.length;
        var optionArr = [];
        while(len){
            optionArr.push({name:optionArr1[len-1], vote:0});
            len--;
        }
        var pollObj = new Polls ({
            name: req.query.name,
            description: desc,
            author: "obinnaeye",
            //author: req.user.github.username,
            options: optionArr
        });
        // CHECK FOR ERROR HERE................../////////////...........
        pollObj.save(function(err){
            console.log("Polls added!");
            if(err){throw "Error occured while adding polls!"}
            res.json(pollObj);
        });
    };
    
    this.userHome = function(req, res){
        if (req.isAuthenticated()){
            if (req.user.github.username === req.params.username){
                res.sendFile(path + "/public/authindex.html");
            }else{
                res.redirect("/" + req.user.github.username);
            }
        }else{
            if (req.params.username === "guest"){
                res.sendFile(path + "/public/index.html");
            }else{
                res.redirect("/guest");
            }
        }
        
    };
    
    this.viewPolls = function(req, res){
        if (req.isAuthenticated()){
            if (req.user.github.username === req.params.username){
                res.sendFile(path + "/public/authpolls.html");
            }else{
                res.redirect("/" + req.user.github.username + "/polls");
            }
        }else{
            if (req.params.username === "guest"){
                res.sendFile(path + "/public/polls.html");
            }else{
                res.redirect("/guest/polls");
            }
        }
    };
    
     //add vote here
    this.addVote = function (req, res) {
        var voteID = req.query.voteid;
        Polls.findOneAndUpdate({"options._id" : voteID}, {$inc : {"options.$.vote" : 1}}, { new: true }, function(err, doc){
            if(err){console.log(err)}
            res.json(doc);
        })
    };
    
    this.newOption = function (req, res) {
        var pollID = req.query.pollid,
            option = req.query.option,
            optionObj = {
                name : option,
                vote: 1
            };
        
        Polls.findOneAndUpdate({"_id" : pollID}, {$push : {"options" : optionObj}}, { new: true }, function(err, doc){
            if(err){console.log(err)}
            res.json(doc);
        })
    };
    
    
    //delete polls here
    this.deletePoll = function (req, res) {
        //var doc = Polls.polls.name
        Polls.romove( {nmae:req.query.name}, function (err) {
            if (err) throw "An Error occured deleting poll."; 
            console.log("Poll deleted!");// removed!
            res.json({deleted: true});
            });
    };
    
    //handle user's profile page api
    this.userDetails = function(req, res){
        if(req.isAuthenticated()){
            res.json(req.user);
        }
        else{
            res.redirect("/guest/login")
        }
    }
    
    this.viewProfile = function(req, res){
        if (req.isAuthenticated()){
            console.log(req.user.github.username);
            if (req.user.github.username === req.params.username){
                res.sendFile(path + "/public/profile.html");
            }else{
                res.redirect("/" + req.user.github.username + "/profile");
            }
        }else{
            res.redirect("/guest/login");
        }
    };
    
    //create get user's own polls here
    this.getUserPolls = function (req, res) {
        Polls
            .find({author : req.query.username})
            .exec(function (err, result) {
                if (err) { throw "No such data"; }
                res.json(result);
            });
    };
    
    //delete poll by user
    this.deletePoll = function (req, res) {
        Polls.findOneAndRemove({_id : req.query.pollid, author: req.user.github.username}, function(err, doc){
            if (err) {throw err}
            else{
                res.json(doc);
            }
        })
    };
    
    
    
}


module.exports = PollHandler;