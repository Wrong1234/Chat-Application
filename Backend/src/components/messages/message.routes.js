import express from "express";
import { verifyToken } from "../../middleware/authMiddleware.js";
import { getMessage, sendMessage } from "./message.controller.js";
import  { multerUpload } from "../../config/multer.js";


const router = express.Router();


router.post("/send", verifyToken, multerUpload.single("file"), sendMessage);
router.get("/get/:id", verifyToken, getMessage);


export default router;