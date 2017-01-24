'use strict';
//var Users = require('../models/users.js');
var Polls = require('../models/polls.js');

function PollHandler () {

     //create get polls here
    this.getPolls = function (req, res) {
        Polls
            .find({}, { '_id': false })
            .exec(function (err, result) {
                if (err) { throw "No such data"; }

                //res.json(result.nbrClicks);
                res.json(result);
            });
    };
    
    //create get polls here
    this.getOnePoll = function (req, res) {
        Polls
            .find({name:req.params.pollname}, { '_id': false })
            .exec(function (err, result) {
                if (err) { throw err; }

                //res.json(result.nbrClicks);
                res.json(result);
            });
    };
    
    //create get polls here
    this.getVotes = function (req, res) {
        Polls
            .findOne({name:req.query.name}, { '_id': false })
            .exec(function (err, result) {
                if (err) { throw err; }

                //res.json(result.nbrClicks);
                res.json(result);
            });
    };
    
    
    //add polls here
    this.addPoll = function (req, res) {
        var optionString = req.query.options;
        var optionArr1 = optionString.split(",");
        var len = optionArr1.length;
        var optionArr = [];
        while(len){
            optionArr.push({name:optionArr1[len-1], vote:0});
            len--;
        }
        var pollObj = new Polls ({
            name: req.query.name,
            description: "",
            votes: 0,
            author: req.query.author,
            options: optionArr
        });
        // CHECK FOR ERROR HERE................../////////////...........
        pollObj.save(function(err){
            console.log("Polls added!")
            if(err){throw "Error occured while adding polls!"}
            res.json(pollObj);
        })
    };
    
    
    //delete polls here
    this.deletePoll = function (req, res) {
        //var doc = Polls.polls.name
        Polls.romove( {nmae:req.query.name}, function (err) {
            if (err) throw "An Error occured deleting poll."; 
            console.log("Poll deleted!")// removed!
            res.json({deleted: true});
            })
        
    };
    
    /**
    this.deletePoll = function (req, res) {
        //var doc = Polls.polls.name
        Polls.polls.update( {}, { $pullAll: {name: [req.query.name] } } )
            .exec(function (err, result) {
                    if (err) { throw err; }

                    res.json(result.polls);
                }
            )
    };
    **/
    
    
}


module.exports = PollHandler;