import Message from './message.model.js';



export const senderMessageService = async({
    receiverId, message, messageType, senderId, mediaUrl
}) => {
    try{
         const sendMessage = await Message.create({
            receiverId,
            senderId,
            message,
            messageType,
            mediaUrl
        });

         const populatedMessage = await sendMessage.populate([
            { path: "senderId", select: "_id profileImage" },
            { path: "receiverId", select: "_id profileImage" }
        ]);

        return populatedMessage;
    }
    catch(err){
        throw new Error('Invalid message send error');
    }
}

// Service
export const getMessageService = async({ receiverId, senderId, page, limit }) => {
  try {
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
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

    return messages.reverse();

  } catch(err) {
    throw new Error("Invalid id, please provide correct id");
  }
}
