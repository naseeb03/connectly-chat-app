import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getSideBarUsers = async(req, res) => {
    try {
        const user = req.user;
        const users = await User.find({ _id: { $ne: user._id } }).select("-password");
        res.status(200).json({
            users
        });
    }
    catch(error) {
        console.log("Error in getSideBarUsers controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMessages = async(req, res) => {
    try {
        const otherUser = req.params.id;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderID: myId, receiverID: otherUser },
                { senderID: otherUser, receiverID: myId },
            ],
        });

        res.status(200).json({
            messages
        });
    }
    catch(error) {
        console.log("Error in getMessages controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const sendMessage = async(req, res) => {
    try {
        const senderID = req.user._id;
        const { id: receiverID } = req.params;
        const { text, image } = req.body;
        
        let imageURL;

        if(image) {
            const uploadedImage = await cloudinary.uploader.upload(image);
            imageURL = uploadedImage.secure_url;
        }

        const newMessage = new Message({
            senderID,
            receiverID,
            text,
            image: imageURL,
        });

        await newMessage.save();

        res.status(201).json({
            newMessage
        });
    }
    catch(error) {
        console.log("Error in sendMessage controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }

}