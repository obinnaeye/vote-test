//add polls for general views

'use strict';

var mongoose = require('mongoose');
var pollSchema = mongoose.Schema;

var Poll = new pollSchema({
    name: String,
    description:String,
    author: String,
    options: [{name:String, vote: Number}]
});

module.exports = mongoose.model('Poll', Poll);