// auth     isStudent    isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
    try{
        //extract JWT token 
        //3 ways -> from request body
        //       -> from cookie
        //       -> from header 
        console.log("body", req.body.token);
        console.log("cookie", req.cookies.token);
        console.log("Header", req.header("Authorization"));

        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ","");
        
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token not found"
            })
        }

        //verify the token 
        try{
            const payload = jwt.verify(token, process.env.SECRET_KEY);
            console.log(payload);

            req.user = payload;  

        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"JWT not verified"
            })
        }

        next();

    } catch (error) {
        return res.status(401).json({
            success:false,
            message:" Something went wrong, while verifying the token"
        })
    }
}


exports.isStudent = (req, res, next) => {
    try{
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for students"
            })
        }
        next();
    } catch(err) {
        return res.status(500).json({
            success:false,
            message:"User role is not matching"
        })
    }
}

exports.isAdmin = (req, res, next) => {
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for admin"
            })
        }
        next();
    } catch(err) {
        return res.status(500).json({
            success:false,
            message:"User role is not matching"
        })
    }
}

