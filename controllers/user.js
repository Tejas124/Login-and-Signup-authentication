const User = require("../models/schema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { options } = require("../routes/route");
require("dotenv").config();

//Signup authentication
exports.signup = async (req,res) => {
    try{
        const {name, email, password, role} = req.body;

        //if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }

        //If user does not exists

        //Secure password -> using bcrypt library
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10); // password hashed
        } catch(error){
            return res.status(500).json({
                success:false,
                message:"Error in Password hashing"
            })
        }

        //Create an entry of user in DB
        const newUser = await User.create({
            name, email, password:hashedPassword, role
        });

        return res.status(200).json({
            success:true,
            data: newUser,
            message:"Entry created Successfully"
        })


    } catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Error in creating user"
        })
    }
}

//Login
exports.login = async(req, res) => {
    try{
        //data fetch 
        const {email, password} = req.body;

        //validation on email and password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please fill all the details carefully"
            })
        }

        //Check if user is registered or not
        let user = await User.findOne({email});

        //If user is not registered
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not registerd" 
            })
        }

        const payload = {
            email : user.email,
            id:user._id,
            role:user.role        
        }

        //Verify password and generate JWT token
        if(await bcrypt.compare(password, user.password)){
            //password match
            let token = jwt.sign(payload, 
                                process.env.SECRET_KEY,
                                {
                                    expiresIn: "2h"
                                });
            
            user = user.toObject(); //Why this ?
            user.token = token;
            user.password = undefined;

            // const options = {
            //     expires: new Date( Date.now() + 3 * 24 * 60 * 60 * 1000),
            //     httpOnly: true  
            // }

            //creating a cookie
            // res.cookie("token", token, options).status(200).json({
            //     success:true,
            //     token,
            //     user,
            //     message:"user logged in successfully"
            // })

            res.status(200).json({
                success:true,
                token,
                user,
                message:"user logged in successfully"
            })
        }

        
    
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Fali to Log in "
        })
    }
}