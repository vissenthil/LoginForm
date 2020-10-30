
//Install npm i dotenv first and than add the ("dotenv").config();  at first in app.js to
//to encrypt the passwordKewy.
require('dotenv').config('SecretsStartingCode\,env');
const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
//const encrypt   = require("mongoose-encryption");
//const md5 = require('md5'); //hashfunction it will change the message or password as hash value and store in db
//const bcrypt = require('bcrypt'); //Level 4 security
//const saltRounds = 10;
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');


const app = express();
console.log(process.env.SECRET);
app.use(express.static("public"));//jshint esversion:6
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended: true}));

//Need use the blow one for session
app.use(session({
        secret:"Our lititle secret.",
        resave: false,
        saveUninitialized: false
         }));
app.use(passport.initialize());
app.use(passport.session());


//Creating dtabase collection with mongodb
mongoose.connect("mongodb://localhost:27017/userDb",{useNewUrlParser: true,
                                                        useUnifiedTopology:true});
mongoose.set('useCreateIndex', true);


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

//process.env.API_KEY; //Comes from .env file

//userSchema.plugin(encrypt,{secret: process.env.SECRET,encryptedFields:["password"]});
// To encrypt Only the passwrod encryptedField["password"]

const User = new mongoose.model("User",userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/",function(req,res){
   res.render("home");
});

app.get("/Login",function(req,res){
   res.render("login");
});

app.get("/register",function(req,res){
   res.render("register");
});

app.get("/secrets",function(req,res){
  if (req.isAuthenticated){
     res.render("secrets");
  }
  else {
    res.redirect('/login');
  }
});

//Post for Register
app.post("/register",function(req,res){
User.register({username:req.body.username},req.body.password,function(err,user){
  if (err){
    console.log(err);
    res.redirect("/register");
  }
  else {
       passport.authenticate("local")(req,res,function(){
         res.redirect("/secrets")
       })
  }
})
});
//End register post here


//User and password autondication start here
app.post("/login",function(req,res){

  const user = new User({
      username:req.body.username,
      password:req.body.password
  });
  req.login(user,function(err){
    if (err){
      console.log(err);
      }
      else{
        passport.authenticate("local")(req,res,function(){
          res.redirect("/secrets")
        })
      }
  })

})
//User and password autondication start End here

app.get("/logout",function(req,res){
  req.logout(); //logout and redirect to home page
  res.redirect("/");
})

app.listen(3000,function(err){
   console.log("Server is up and listening port 3000");
})
