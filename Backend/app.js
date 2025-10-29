import express from 'express';
import db from './utils/dbConnection.js';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from "cookie-parser";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// app.use('/api', appRoutes);




const PORT = 4000;
const url =
  "mongodb+srv://learnMongodb:HLrsY7oQwSKhOnD0@lerarnmongodb.lvnv3wl.mongodb.net/chatapp";
// const url = process.env.url;
const server = async () => {
  try {
    await db(url);
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("❌ Server failed to start:", error);
  } 
};

server(); 

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5000",
  },
});

io.on("connection", (socket) =>{
  console.log("connected to socket.io");
})