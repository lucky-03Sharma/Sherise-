const User = require ("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req , res) => {
    try{
        const{name , email , password } =req.body;
        const userExists = await User.findOne({email});
    if(userExists){
        return res.status(400).json({message:"User already exists"});
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password , salt);
}catch(error) {
    res.status(500).json({ error: error.message });
  }
}