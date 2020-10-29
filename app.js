
//Install npm i dotenv first and than add the ("dotenv").config();  at first in app.js to
//to encrypt the passwordKewy.
require('dotenv').config('SecretsStartingCode\,env');
const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
//const encrypt   = require("mongoose-encryption");
//const md5 = require('md5'); //hashfunction it will change the message or password as hash value and store in db
const bcrypt = require('bcrypt'); //Level 4 security
const saltRounds = 10;
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

//userSchema.plugin(encrypt,{secret: process.env.SECRET,encryptedFields:["password"]});
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

bcrypt.hash(req.body.password,saltRounds, function (err,hash){
  const newUser = new User ({
    email: req.body.username,
    //password: md5(req.body.password) //storing the password using hashfunction
    password: hash //assining the hash value for the password which is generted using bcrypt.hash above
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




});
//End register post here


//User and password autondication start here
app.post("/login",function(req,res){
  const userName = req.body.username;
  //const Password = md5(req.body.password); //hash value will be generted for the password
                                           //will be chacked here if inside the dtabase password hash value
                                          // and now generated hash value are same it will allow
 const Password = req.body.password;
  console.log(userName + '' + Password);
  User.findOne({email: userName},function(err,foundUser){
    console.log('password:' + foundUser.password);
   if (!err){
     if (foundUser){
      bcrypt.compare(Password, foundUser.password, function(err, result) {
        // Store hash in your password DB.
        console.log(foundUser.password);
        if (!err){
            res.render("secrets");
        }
    });

    }
  }
})
})
//User and password autondication start End here


app.listen(3000,function(err){
   console.log("Server is up and listening port 3000");
})
