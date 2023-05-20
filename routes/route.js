const express = require("express");
const { signup, login } = require("../controllers/user");
const router = express.Router();
const {auth, isStudent, isAdmin} = require("../middlewares/auth");

router.post("/signup", signup);
router.post("/login", login);

//Protected route
router.get("/test", auth, (req, res) => {
    res.json({
        success:true,
        message: "Testing route"
    })
})

router.get("/student", auth, isStudent, (req, res) => {
    res.json({
        success:true,
        message: "Welcome to the protected route for students"
    })
})

router.get("/admin", auth, isAdmin, (req, res) => {
    res.json({
        success:true,
        message: "Welcome to the protected route for Admins"
    })
})

module.exports = router;
