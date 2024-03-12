import express from 'express';
import FileController from '../contoller/file.controller.js';
import { upload } from '../middlewares/fileUpload.js';

export const fileRouter = express.Router();

const fileController = new FileController();

fileRouter.post('/add',upload.single('csv'), (req, res, next)=>{
    fileController.addFile(req, res, next)
})

fileRouter.get('/get/:filename', (req, res, next)=>{
    fileController.getCsvFile(req, res, next);
})