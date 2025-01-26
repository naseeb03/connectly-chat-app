import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { uploadToCloudinary } from "../utils/upload.utils.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getSideBarUsers = async (req, res) => {
    try {
        const user = req.user;
        const users = await User.find({ _id: { $ne: user._id } }).select("-password");
        res.status(200).json(
            users
        );
    } catch (error) {
        console.log("Error in getSideBarUsers controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.user._id;
        const { id: receiverId } = req.params;
        const { text, image } = req.body;

        let imageURL;

        if (image) {
            const uploadedImage = await uploadToCloudinary(image, "chat");
            imageURL = uploadedImage.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageURL,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json({
            newMessage
        });
    } catch (error) {
        console.log("Error in sendMessage controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }

}