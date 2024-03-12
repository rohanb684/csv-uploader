import FileModel from "../model/file.model.js";
import fs from 'fs';
import path from "path";
import { dirname } from 'path';

export default class FileController{


    addFile(req, res, next){
        const filename = req.file.filename;
        const name = req.body.name;
        const isCSV = FileModel.isCSV(filename);
        if(isCSV){
            const file = FileModel.add({name, filename});
            console.log(file);
            return res.status(201).json({success:true, file ,message:"File successfully submitted"});
        }
    }

    getCsvFile(req, res, next){
        const filename = req.params.filename;
        // console.log("params filename: "+ filename);
        const filePath = path.join("src", "uploads", filename); 

        if(fs.existsSync(filePath)){
            // console.log("inside fs.existSync")
            // Set the appropriate headers for file download
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `inline; filename=${filename}`);

            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        }else{
            res.status(404).json({success:false, message:"File not found"})
        }
    }
}