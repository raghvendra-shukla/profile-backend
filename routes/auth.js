const express=require("express");
const User=require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchprofile=require("../middelware/fetchprofile");

const JWT_SECRET="Rannyisagood$boy";

// Route1:create a user using post: ./api/auth/ 
router.post('/createuser',[
  body("name").isLength({min:3}),
  body("email").isEmail(),
  body("password").isLength({min:5})
], async (req, res) => {
  let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try{
    let user=await User.findOne({email:req.body.email});
    if(user){
      return res.status(400).json({ errors: "invalid email" });
    }
    const salt = await bcrypt.genSalt(10);
    const secpass = await bcrypt.hash(req.body.password, salt);
    user= await User.create({
      name: req.body.name,
      email:req.body.email,
      password:secpass,});
      const data={
        user:{
          id:user.id
        }
      }
      const Authtoken=jwt.sign(data,JWT_SECRET);
      success=true;
      res.json({success,Authtoken});
    }
    catch(error){
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  });
// Route2:creating a login endpoint using post request
  router.post('/login',[
    body("email").isEmail(),
    body("password","password cannot be blank").exists()
  ], async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {email,password}=req.body;
    try{
      let user=await User.findOne({email});
      if(!user){
        return res.status(400).json({ errors: "user does not exist" });
      }

      const passwordCompare= await bcrypt.compare(password,user.password);
      if(!passwordCompare){
        return res.status(400).json({ errors: "user does not exist" });
      }

      const data={
        user:{
          id:user.id
        }
      }
      const Authtoken=jwt.sign(data,JWT_SECRET);
      success=true;
      res.json({success,Authtoken});
      }
      catch(error){
        console.error(error.message);
        res.status(500).send("Internal error occured");
      }

    });

    // Route3:creating a getuser endpoint using post request
  router.post('/getuser',fetchprofile,async (req, res) => {
    try{
      userid=req.user.id;
      const user=await User.findById(userid).select("-passward");
      res.send(user);
      }
      catch(error){
        console.error(error.message);
        res.status(500).send("Internal  server error occured");
      }

    });

module.exports=router