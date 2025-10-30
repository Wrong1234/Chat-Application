import { generateResponse } from "../../middleware/responseFormate.js";
import { senderMessageService, getMessageService} from "./message.service.js";


const sendMessage = async(req, res, next) =>{

    const { chatId, message, messageType, mediaUrl} = req.body;
    const senderId = req.user._id;

    try{

        const result = await senderMessageService({ chatId, message, senderId, messageType, mediaUrl});
        console.log(result);
        generateResponse(res, 201, true, "Message Send Successfully", result);

    }catch(err){
        generateResponse(res, 404, false, "Provide corrected information", null);
    }
}

const getMessage = async (req, res) => {
  const { page = 1, limit = 10, sort = "-createdAt" } = req.query;
  const { id } = req.params;
  const senderId = req.user._id;

  try {
    const messages = await getMessageService({
      id,
      senderId,
      page: Number(page),
      limit: Number(limit),
      sort,
    });

    generateResponse(res, 200, true, "Get all messages successfully", messages);
  } catch (err) {
    console.error(err);
    generateResponse(res, 404, false, "Send valid id", null);
  }
};



export {
    sendMessage,
    getMessage
}