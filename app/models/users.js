//add polls for general views

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    github: {
        id: String,
        displayName: String,
        username: String,
        publicRepos: Number,
        profilePicture: Array
    },
   votes: [{pollName:String, votedOption:String}]
});

module.exports = mongoose.model('Users', User);