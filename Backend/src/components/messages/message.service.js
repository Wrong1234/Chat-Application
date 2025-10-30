import Message from './message.model.js';



export const senderMessageService = async({
    chatId, message, messageType, senderId, mediaUrl
}) => {
    try{
         const sendMessage = await Message.create({
            chat: chatId,
            sender: senderId,
            message,
            messageType,
            mediaUrl
        });

        return sendMessage;
    }
    catch(err){
        throw new Error('Invalid message send error');
    }
}

export const getMessageService = async({ id, senderId, page, limit }) => {

    try{

        const messages = await Message.find({
            chat: id,
            deletedFor: { $ne: senderId }
            })
            .populate('sender', 'name profilePicture')
            .populate('replyTo')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        return messages;


    }catch(err){
        throw new Error("Invalid id provide correct id");
    }
}
