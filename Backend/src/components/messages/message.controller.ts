import { generateResponse } from "../../middleware/responseFormate.js";
import { senderMessageService, getMessageService } from "./message.service.js";

const sendMessage = async(req, res, next) => {
    try {
        const { receiverId, message, messageType, mediaUrl } = req.body;
        const senderId = req.user._id;
        const file = req.file;

        // ✅ Validate input
        if (!receiverId) {
            return generateResponse(res, 400, false, "Receiver ID is required", null);
        }
        if (!message && !file) {
            return generateResponse(res, 400, false, "Message or file is required", null);
        }


        console.log('📨 Send message request:', {
            receiverId,
            senderId,
            message,
            hasFile: !!file,
            fileName: file?.originalname
        });

        const result = await senderMessageService({ 
            receiverId, 
            message, 
            senderId, 
            messageType, 
            mediaUrl, 
            file 
        });

        const io = req.app.get('io');
        const chatRoomId = [senderId, receiverId].sort().join('-');
        io.to(`chat:${chatRoomId}`).emit('receive-message', result);
        
        generateResponse(res, 201, true, "Message sent successfully", result);

    } catch(err) {
        console.error('❌ Send message error:', err);
        generateResponse(res, 500, false, err.message || "Failed to send message", null);
    }
}

// Controller
const getMessage = async (req, res) => {

    const { page = 1, limit = 10, sort = "-createdAt" } = req.query;
    const { id } = req.params; // receiverId
    const senderId = req.user._id;
    const receiverId = id;

    try {
        const messages = await getMessageService({
            receiverId,
            senderId,
            page: Number(page),
            limit: Number(limit),
            sort,
        });

        generateResponse(res, 200, true, "Messages retrieved successfully", messages);
    } catch (err) {
        console.error('❌ Get messages error:', err);
        generateResponse(res, 404, false, err.message || "Failed to retrieve messages", null);
    }
};

export {
    sendMessage,
    getMessage
}