const express = require('express');
const authRouter = express.Router();

const { signup, login, logout, sendotp, onboarding } = require('../controllers/auth.controller');
const { auth } = require('../middlewares/auth')

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/sendotp", sendotp);
authRouter.patch('/onboarding', auth, onboarding);
authRouter.get('/me', auth, (req, res) => {
    const userObject = req.user.toObject();
    userObject.token = req.user.token;
    userObject.friendRequestCount = req.user.friendRequestCount;

    return res.status(200).json({
        success: true,
        message: "User is authenticated",
        data: userObject,
    });
});


module.exports = authRouter;
