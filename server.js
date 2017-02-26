'use strict';

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
}else{
    //load my env file
    require('dotenv').load();
    var express = require('express'),
    routes = require('./app/routes/index.js'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    session = require('express-session');
    //var RedisStore = require("connect-redis")(session);
    var MongoStore = require("connect-mongo")(session);

    
    var MONGODB_URI=process.env.MONGODB_URI;
    
    var app = express();
    
    require('./app/config/passport')(passport);
    
    mongoose.connect(MONGODB_URI);
    
    app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
    app.use('/public', express.static(process.cwd() + '/public'));
    app.use('/common', express.static(process.cwd() + '/app/common'));
    
    
    
    var sess = {
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: false,
            cookie: {},
            store: new MongoStore({ mongooseConnection: mongoose.connections[0] })
        }

    if (app.get('env') === 'production') {
        app.set('trust proxy', 1) // trust first proxy
        sess.cookie.secure = true; // serve secure cookies
        sess.cookie.maxAge = 1000 * 60 * 60 * 14; //14 days
    }

    app.use(session(sess));
    
    
    app.use(passport.initialize());
    app.use(passport.session());
    
    //allow cross-domain access to the api
    /*app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });*/
    
    
    routes(app, passport);
    
    app.listen(process.env.PORT, function(){
        console.log("Your Connection Listening at port: ", process.env.PORT);
    });
}