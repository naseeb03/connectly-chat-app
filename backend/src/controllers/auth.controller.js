import User from '../models/user.model.js';
import { generateToken } from '../utils/token.utils.js';
import bcrypt from 'bcryptjs';
import { uploadToCloudinary } from '../utils/upload.utils.js';

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            createdAt: user.createdAt,
        });
    } catch (error) {
        console.log("Error in Login route: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // const profilePicUrl = `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(name)}`;

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            // profilePic: profilePicUrl,
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        }
    } catch (error) {
        console.log("Error in signup route: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            maxAge: 0,
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout route: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userID = req.user._id;

        if(!profilePic) {
            return res.status(400).json({ message: "Profile picture is required" });
        }

        const uploadResponse = await uploadToCloudinary(profilePic, "profile");
        const updatedUser = await User.findByIdAndUpdate(userID, {
            profilePic: uploadResponse.secure_url,
        }, { new: true });

        res.status(200).json(
            updatedUser,
        );
    } catch(error) {
        console.log("Error in updateProfile route: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const checkAuth = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json(
            user
        );
    } catch (error) {
        console.log("Error in checkAuth route: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}