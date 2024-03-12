import express, {urlencoded} from 'express';
import path from 'path';
import cookieParser from "cookie-parser";

const server = express();


server.use(cookieParser());
server.use(express.json());
server.use(express.static(path.resolve("src", "public")));
server.use(urlencoded({ extended: true }));

server.use()