import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import {app, server} from "./lib/socket.io.js"

//for deplyoment
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const Port = process.env.PORT || 5001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname)

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173"
];

connectDB();
app.use(express.json({
    limit :"50mb",
}));
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

//for prodution
if(process.env.NODE_ENV === "production"){
  console.log("this is running...")
  app.use(express.static(path.join(__dirname , "../../frontend/dist")));

  app.get("*",(_req,res)=>{
    res.sendFile(path.join(__dirname,"../../frontend","dist","index.html"))
  })
}

server.listen(Port, () => console.log(`server is running ${Port} `));
