const User = require('../models/user.models');
const Otp = require('../models/otp.models')
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const otpGenerator = require('otp-generator')
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const serverClient = require('../config/stream')

const sendotp = async (req, res) => {
    try {
        const { email } = req.body;

        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(400).json({
                success: false,
                message: "User already exist"
            })
        }

        const otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        Otp.create({ email: email, otp: otp });

        console.log(otp)

        return res.status(200).json({
            success: true,
            message: `Otp ${otp} sent successfully to ${email}`,
        })
    }
    catch (error) {
        console.log('Error occured at sendotp', error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const signup = async (req, res) => {
    try {
        const { email, fullName, password, otp } = req.body;

        if (!email || !fullName || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password is too short"
            })
        }

        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const otpCreated = await Otp.findOne({ email: email }).sort({ createdAt: -1 }).limit(1);

        if (!otpCreated) {
            return res.status(400).json({
                success: false,
                message: "Otp is expired"
            })
        }

        if (otp != otpCreated.otp) {
            return res.status(401).json({
                success: false,
                message: "Otp is incorrect"
            })
        }

        const avatar = 'https://avatar.iran.liara.run/public';

        const hashedPassword = await bcryptjs.hash(password, 10);

        const userCreated = await User.create({ email, fullName, password: hashedPassword, avatar });

        const jwtToken = await jsonwebtoken.sign({ userId: userCreated._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        });

        userCreated.password = undefined;

        await serverClient.upsertUser({
            id: userCreated._id,
            name: fullName,
            image: avatar,
        });

        return res.cookie("token", jwtToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        }).status(201).json({
            success: true,
            message: "User created successfully",
            data: userCreated
        })
    }
    catch (error) {
        console.log("Error occured in Signup function", error.message)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userExist = await User.findOne({ email: email });

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        if (!userExist) {
            return res.status(404).json({
                success: false,
                message: "User not registered"
            })
        }

        if (await bcryptjs.compare(password, userExist.password)) {

            const payload = {
                userId: userExist._id
            }

            const jwtToken = jsonwebtoken.sign(payload, process.env.JWT_SECRET_KEY, {
                expiresIn: "7d"
            })

            userExist.password = undefined;

            return res.cookie("token", jwtToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true
            }).status(200).json({
                success: true,
                message: "User login successful",
                data: userExist
            })
        }

        return res.status(400).json({
            success: false,
            message: "Password is incorrect"
        })
    }
    catch (error) {
        console.log("Error occured in login function", error.message)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({
            success: true,
            message: "Logout successful"
        })
    }
    catch (error) {
        console.log("Error occured in SignUp function", error.message)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const onboarding = async (req, res) => {
    try {
        const { address = null, username = null, gender = null, dob = null, phone = null, nativeLanguage = null, proficientLanguages = null, interests = null, country = null, bio = null } = req.body;
        const userId = req.user._id;
        const file = req?.files?.file;

        if (!nativeLanguage || !interests) {
            const missingFields = [
                !nativeLanguage && "Native-Language",
                !proficientLanguages && "Proficient-Language",
                !interests && "Interests"
            ].filter(Boolean);

            return res.status(400).json({
                success: false,
                message: `Missing fields: ${missingFields.join(', ')}`
            });
        }

        const userData = {};

        if (address != null) userData.address = address;
        if (username != null) userData.username = username;
        if (gender != null) userData.gender = gender;
        if (dob != null) userData.dob = dob;
        if (phone != null) userData.phone = phone;
        if (nativeLanguage != null) userData.nativeLanguage = nativeLanguage;
        if (proficientLanguages != null) userData.proficientLanguages = proficientLanguages;
        if (interests != null) userData.interests = interests;
        if (country != null) userData.country = country;
        if (bio != null) userData.bio = bio;

        const userExist = await User.findOne({ _id: userId });

        if (!userExist) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        }

        if (userExist.isOnboarded == true) {
            return res.status(400).json({
                success: false,
                message: "User is already onboarded"
            })
        }

        const usernameExist = await User.findOne({ username: username });

        if (usernameExist) {
            return res.status(400).json({
                success: false,
                message: "Username already exists"
            })
        }

        if (file) {
            const response = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'streamify'
            });

            userData.avatar = response.secure_url;
        }

        userData.isOnboarded = true;

        const userUpdated = await User.findByIdAndUpdate(userId, {
            $set: userData
        }, { new: true });

        userUpdated.password = undefined;

        return res.status(200).json({
            success: true,
            message: "User onboarded successfully",
            data: userUpdated
        })
    }
    catch (error) {
        console.log("Error occured in onboarding function", error.message)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

// forget password 
// reset password
// welcome email for onboarding
// delete account
// change account settings such as name username age phone address

module.exports = { signup, login, logout, sendotp, onboarding }