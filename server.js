'use strict';

    var express = require('express'),
    routes = require('./app/routes/index.js'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    session = require('express-session');
    //var RedisStore = require("connect-redis")(session);
    var MongoStore = require("connect-mongo")(session);

    
    var MONGODB_URI=process.env.MONGODB_URI;
    
    var app = express();
    require('dotenv').load();
    require('./app/config/passport')(passport);
    
    mongoose.connect("mongodb://localhost:27017/votingapp");
    
    app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
    app.use('/public', express.static(process.cwd() + '/public'));
    app.use('/common', express.static(process.cwd() + '/app/common'));
    
    
    
    var sess = {
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: true,
            cookie: {},
            store: new MongoStore({ mongooseConnection: mongoose.connections[0] })
        }

    if (app.get('env') === 'production') {
        app.set('trust proxy', 1) // trust first proxy
        sess.cookie.secure = true; // serve secure cookies
        sess.cookie.maxAge = 1000 * 60 * 60 * 14; //14 days
    }

    app.use(session(sess))
    
    /**app.use(session({
        secret: 'secretClementine',
        resave: false,
        saveUninitialized: true
    }));**/

    app.use(passport.initialize());
    app.use(passport.session());
    
    /**app.use(function (req, res, next) {
        res.locals.user = req.user;
        next();
    });**/
    
    routes(app, passport);
    
    
app.listen(process.env.PORT, function(){
    console.log("Your Connection Listening at port: ", process.env.PORT);
});
