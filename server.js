import express, {urlencoded} from 'express';
import path from 'path';
import cookieParser from "cookie-parser";
import { fileRouter } from './src/routes/file.route.js';

const server = express();


server.use(cookieParser());
server.use(express.json());
server.use(express.static(path.resolve("src", "public")));
server.use(urlencoded({ extended: true }));

server.use('/csv' , fileRouter);

server.listen(3500, async()=>{
    console.log("server listening at 3500")
})