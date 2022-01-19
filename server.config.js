var express = require('express');
var body_parser = require('body-parser');
var mongoose = require('./mongoose.config');
var passport = require("passport");
var LocalStrategy = require("passport-local");

var Strategy = require('passport-twitter').Strategy

var session = require('express-session'); 




var User = require('../students/models/models.users');



require('dotenv').config();
var app = express();

app.use(body_parser.urlencoded({
    extended : true
}));

app.use(body_parser.json());
var db = new mongoose();
app.set('view engine', 'ejs');
app.use(require("express-session")({ //session instance
    secret: "MySecret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());





passport.use(new Strategy({

    consumerKey: 'rDhdeme55N76HwfUuxALyfpkC',
    consumerSecret : 'rFU9xY6PEColB8Cl68SGnCtBkjwdZ1OR94pt00U7NNnfyU4jm7',
    callbackURL : 'http://127.0.0.1:3000/twitter/return',
  
}, 
function(token,tokenSecret,profile,callback){
    return callback(null, profile);
}));


passport.serializeUser(function(user, callback){
    callback(null, user);
})

passport.deserializeUser(function(obj,callback){
    callback(null, obj);

})

app.use(session(
    {secret: 'pavan',
     resave: true,
     cookie: { secure: false },
    saveUninitialized: true
})) 



app.get('/', function(req, res){
    res.render('index',{user: req.user})
})
app.get('/twitter/login', passport.authenticate('twitter'))
app.get('/twitter/return', passport.authenticate('twitter',{
    failureRedirect: '/'
}))





passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());      
passport.deserializeUser(User.deserializeUser());  
var express_port = process.env.PORT || 3000;
app.use(express.static('public'));
app.listen(express_port);
console.log('Server Started!');

module.exports = app;