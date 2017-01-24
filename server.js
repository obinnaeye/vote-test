'use strict';
var path = process.cwd();

//if you use cluster in C9, run server using node server.js

var cluster = require("cluster");

// Code to run if we're in a master process
if (cluster.isMaster){
    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
    
    // Listen for dying workers
cluster.on('exit', function (worker) {

    // Replace the dead worker,
    // we're not sentimental
    console.log('Worker %d died :(', worker.id);
    cluster.fork();

});

// Code to run if we're in a worker process
}
else{
    var express = require('express'),
    routes = require('./app/routes/index.js'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    session = require('express-session');
    var MONGODB_URI=process.env.MONGODB_URI;
    
    var app = express();
    
    mongoose.connect("mongodb://heroku_r87zx5hw:dg5t3bu5sk6r2ca11sajfeap0s@ds117869.mlab.com:17869/heroku_r87zx5hw");
    
    app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
    app.use('/public', express.static(process.cwd() + '/public'));
    app.use('/common', express.static(process.cwd() + '/app/common'));
    
    routes(app);
    
    
app.listen(process.env.PORT, function(){
    console.log("Your Connection Listening at port: ", process.env.PORT);
});
}