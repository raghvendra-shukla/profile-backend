const express=require("express");
const router = express.Router();
const Profile=require('../models/Profile');
const { body, validationResult } = require('express-validator');
const { request } = require("express");
const fetchprofile = require("../middelware/fetchprofile");

// Route1: fetchingAllProfile using get request
router.get('/fetchallprofile',fetchprofile, async(req, res) => {
    try {
      const profile=await Profile.find();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  });

// Route2: fetchingAProfile using get request
router.get('/fetchaprofile',fetchprofile, async(req, res) => {
  try {
    const profile=await Profile.find({user:req.user.id}).limit(1).sort({$natural:-1});
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
});

// Route2: adding new profile using post 
router.post("/addprofile",[
  body("name","please write a name of atleast 2-char").isLength({min:2}),
  body("degree"),
  body("languages"),
  body("exprience"),
  body("projects")
],fetchprofile,async(req,res)=>{
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try{
    const {name,degree,languages,exprience,projects}=req.body;
    const profile=new Profile({
      name,degree,languages,exprience,projects,user:req.user.id
    });
    const saveData=await profile.save();
    res.json(saveData);
  }catch(error){
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
});

// Route3:Updateing the existing profile
router.put("/updateprofile/:id",fetchprofile,async (req,res)=>{
  const {name,degree,languages,exprience,projects}=req.body;
  // creating a profile object
  const newprofile={};
  if(name){newprofile.name=name};
  if(degree){newprofile.degree=degree};
  if(languages){newprofile.languages=languages};
  if(exprience){newprofile.exprience=exprience};
  if(projects){newprofile.projects=projects};
  //find the profile to be update and update it
  let profile=await Profile.findById(req.params.id);
  if(!profile){return res.status(404).send("Not Found")};
  if(profile.user.toString()!==req.user.id){
    return res.send("Not Allowed");
  }
  profile=await Profile.findByIdAndUpdate(req.params.id,{$set:newprofile},{new:true});
  res.json({profile});
});

// Route:4 delete the using delete request
router.delete("/deleteprofile/:id",fetchprofile,async (req,res)=>{
  //find the profile to be delete and delete it
  try{
    let profile=await Profile.findById(req.params.id);
    if(!profile){return res.status(404).send("Not Found")};
    if(profile.user.toString()!==req.user.id){
      return res.send("Not Allowed");
    }
    profile=await Profile.findByIdAndDelete(req.params.id);
    res.json("Success:The note has been deleted");
  }
  catch(error){
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports=router