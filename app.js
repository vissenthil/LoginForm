
//Install npm i dotenv first and than add the ("dotenv").config();  at first in app.js to
//to encrypt the passwordKewy.
require('dotenv').config('SecretsStartingCode\,env');
const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const encrypt   = require("mongoose-encryption");
const app = express();
console.log(process.env.SECRET);
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));//jshint esversion:6


//Creating dtabase collection with mongodb
mongoose.connect("mongodb://localhost:27017/userDb",{useNewUrlParser: true,
                                                        useUnifiedTopology:true});



const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//process.env.API_KEY; //Comes from .env file

userSchema.plugin(encrypt,{secret: process.env.SECRET,encryptedFields:["password"]});
// To encrypt Only the passwrod encryptedField["password"]

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
   res.render("home");
});

app.get("/Login",function(req,res){
   res.render("login");
});

app.get("/register",function(req,res){
   res.render("register");
});

//Post for Register
app.post("/register",function(req,res){

const newUser = new User ({
  email: req.body.username,
  password: req.body.password
});
newUser.save(function(err){
  if (!err){
    console.log("User created Successfuly");
    res.render("secrets");
  }
  else{
    res.send(err);
  }
})

});
//End register post here


//User and password autondication start here
app.post("/login",function(req,res){
  const userName = req.body.username;
  const Password = req.body.password;
  console.log(userName + '' + Password);
  User.findOne({email: userName},function(err,foundUser){
    console.log('password:' + foundUser.password);
   if (!err){
     if (foundUser){
         if (foundUser.password === Password){
           console.log("User Found");
             res.render('secrets');
         }
     }
   }
   else {
     console.log(err);
   }

  })

});
//User and password autondication start End here




app.listen(3000,function(err){
   console.log("Server is up and listening port 3000");
})
