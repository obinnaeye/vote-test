var path = process.cwd();
var PollHandler = require( path + "/app/controllers/pollController.server.js");



module.exports = function(app, passport){
    //check if user is authenticated
    function isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/login');
        }
    }
    
    var pollHandler = new PollHandler();
    
    app.route("/")
        .get(function(req, res){
            if (req.isAuthenticated()){
                var username = req.user.github.username;
                res.redirect("/" + username);
            }
            else{
                res.redirect("/guest");
            }
        });
    
    app.route("/:username")
        .get(pollHandler.userHome);
    
    app.route("/:username/about")
        .get(function(req, res){
            res.send("Sorry! We are currently working on this page!");
        });
        
    app.route("/:username/profile")
        .get(function(req, res){
            res.send("Sorry! We are currently working on this page!");
        });
        
    app.route("/guest/login")
        .get(function(req, res){
            res.sendFile(path + '/public/login.html');
        });
    
    app.route("/guest/signup")
        .get(function(req, res){
            res.send("Sorry! We are currently working on this page!");
        });
    
    app.route("/:username/polls")
        .get(pollHandler.viewPolls);
        
    app.route("/:username/polls/:id")
        .get(pollHandler.pollPage);
        
        
    
//common root for all requests
//check for queries and return json api is q is given
    app.route("/api/polls")
        .get(pollHandler.getPolls)
        .post(isLoggedIn, pollHandler.addPoll)
        .delete(isLoggedIn, pollHandler.deletePoll);
        
    app.route("/api/poll")
        .get(pollHandler.getOnePoll);
        
    app.route("/api/votes")
        .get(pollHandler.getVotes)
        .post(pollHandler.addVote);
    
    app.route("/api/session")
        .get(function(req, res){
            req.session.pathUrl =req.query.pathUrl;
            res.send(req.session.pathUrl);
        });
        
        
//........................FOR AUTH......................//
    app.route('/user/logout')
        .get(function (req, res) {
            req.logout();
            res.redirect(req.session.pathUrl);
    });
    
    // authenticate user on github
    app.route('/auth/github')
    .get(passport.authenticate('github'));
    
    
    
    //OAuth response
     app.route('/auth/github/callback')
    .get(function(req, res, next) {
      passport.authenticate('github', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.redirect(req.session.pathUrl);
        });
      })(req, res, next);
    });

};