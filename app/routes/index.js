var path = process.cwd();
var PollHandler = require( path + "/app/controllers/pollController.server.js");
var pollHandler = new PollHandler();



module.exports = function(app){
    app.route("/")
        .get(function(req, res){res.sendFile(path + '/public/index.html')});
    
    app.route("/home")
        .get(function(req, res){
            res.sendFile(path + '/public/index.html');
        });
        
    app.route("/about")
        .get(function(req, res){
            res.send("Sorry! We are currently working on this page!");
        });
        
    app.route("/login")
        .get(function(req, res){
            res.send("You are to Login");
        });
    
    app.route("/signup")
        .get(function(req, res){
            res.send("Sorry! We are currently working on this page!");
        });
    
    app.route("/polls")
        .get(function(req, res){
            res.sendFile(path + '/public/polls.html');
        });
        
    app.route("/polls/:pollname")
        .get(function(req, res){
            res.sendFile(path + '/public/polls.html');
        });

//common root for all requests
//check for queries and return json api is q is given
    app.route("/api/poll")
        .get(pollHandler.getPolls)
        .post(pollHandler.addPoll)
        .delete(pollHandler.deletePoll);
        
     app.route("/api/polls/:pollname")
        .get(pollHandler.getOnePoll);
};