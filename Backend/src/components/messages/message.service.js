import Message from './message.model.js';
import uploadToCloudinary from "../../lib/uploadToCloudinary.js"
import { getFileType, getResourceType } from "../../lib/fileTypeDetector.js"

export const senderMessageService = async({
    receiverId, message, messageType, senderId, mediaUrl, file
}) => {
    try {
        // ✅ Prepare message data
        const messageData = {
            receiverId,
            senderId,
            message: message || '', // Allow empty message if file exists
            messageType: file ? 'file' : (messageType || 'text'),
            mediaUrl: mediaUrl || null,
        };

        // ✅ Create message with all data at once
        const sendMessage = await Message.create(messageData);

        console.log('✅ Message created:', sendMessage._id);

        // ✅ Upload file AFTER creating message (so we can rollback if upload fails)
        if (file) {
            try {
                console.log('📤 Uploading file to Cloudinary...');
                
                const fileType = getFileType(file.mimetype, file.originalname);
                const resourceType = getResourceType(fileType);

                const result = await uploadToCloudinary(
                    file.buffer,
                    file.originalname,
                    "message-files", // ⚠️ Changed from "podcast-thumbnails" to more appropriate folder
                    resourceType
                );

                // ✅ Update message with file info
                sendMessage.fileUrl = result.secure_url;
                sendMessage.publicId = result.public_id;
                sendMessage.cloudinaryId = result.public_id;
                sendMessage.fileType = fileType;
                sendMessage.fileName = file.originalname; // ✅ Added missing fileName
                sendMessage.mimeType = file.mimetype;
                sendMessage.fileSize = file.size;
                sendMessage.uploadedAt = new Date();

                await sendMessage.save();
                
                console.log('✅ File uploaded successfully:', result.secure_url);

            } catch (uploadError) {
                console.error('❌ File upload failed:', uploadError);
                // ✅ Rollback: Delete the message if file upload fails
                await Message.findByIdAndDelete(sendMessage._id);
                throw new Error(`Failed to upload file to Cloudinary: ${uploadError.message}`);
            }
        }

        // ✅ Populate sender/receiver info
        const populatedMessage = await Message.findById(sendMessage._id)
            .populate('senderId', '_id name email profileImage')
            .populate('receiverId', '_id name email profileImage')
            .lean();

        console.log('✅ Message populated and ready');
        return populatedMessage;

    } catch(err) {
        console.error('❌ Message service error:', err);
        throw new Error(`Failed to send message: ${err.message}`);
    }
}

export const getMessageService = async({ receiverId, senderId, page, limit }) => {
    try {
        // ✅ Validate inputs
        if (!receiverId || !senderId) {
            throw new Error('receiverId and senderId are required');
        }

        // ✅ Set default values for pagination
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 50;

        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ],
            deletedFor: { $nin: [senderId] }
        })
        .populate('senderId', 'name profileImage')
        .populate('receiverId', 'name profileImage')
        .populate({
            path: 'replyTo',
            populate: {
                path: 'senderId',
                select: 'name profileImage'
            }
        })
        .sort({ createdAt: -1 })
        .limit(limitNumber)
        .skip((pageNumber - 1) * limitNumber)
        .lean();

        return messages.reverse();

    } catch(err) {
        console.error('❌ Get messages error:', err);
        throw new Error(`Failed to get messages: ${err.message}`);
    }
}