//add polls for general views

'use strict';

var mongoose = require('mongoose');
var pollSchema = mongoose.Schema;

var Polls = new pollSchema({
    name: String,
    description:String,
    votes: Number,
    author: String,
    options: [{name:String, vote: Number}]
});

module.exports = mongoose.model('Polls', Polls);