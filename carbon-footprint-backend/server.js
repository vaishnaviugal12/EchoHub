import express from 'express';
const app = express();
import dotenv from 'dotenv';
import {main} from './config/db.js'
import cookieParser from 'cookie-parser';
import redisClient from './config/redis.js';
import cors from 'cors';
import mongoose from 'mongoose';
import Userrouter from './routes/userroutes.js';
import carbonRouter from './routes/carbonRouter.js';
import communityRoutes from './routes/communityRoutes.js';
import newsRoutes from'./routes/newsRoutes.js'
import eventRouter from "./routes/eventRoutes.js";


app.use(cors({
     origin: "http://localhost:5173",
     credentials :true
}));
//middleware fro converting the json data  from request body to javascript object
app.use(express.json());
app.use(cookieParser());
dotenv.config();







const InitializeConnection = async (req,res)=>{

try{
await Promise.all([main(),redisClient.connect()]);
console.log("DB connected");


    app.listen(process.env.PORT, ()=>{
console.log("Server listenng at the port :"+process.env.PORT);
})
  



} catch(error){
 console.log("error occured"+error)
}


}

InitializeConnection();

app.use("/api/user", Userrouter);
app.use("/api/carbon", carbonRouter);

app.use('/uploads', express.static('uploads'));

// Mount routes
app.use('/api/community', communityRoutes);

app.use("/api/news", newsRoutes);
app.use("/api/events", eventRouter);

















