import { Request, Response } from "express";
import fs, { promises as fsPromises } from "fs";
import { imageResizer } from "../utils/imageResizer";
import { log } from "util";

const thumbFolder = "thumb";

const imagesFolder = "images";

export class ImageReduction{

  async imageReducer (req: Request, res: Response) {
    //get filename, width and height from the query
    const filename: any = req.query["filename"];
    const width: any = req.query["width"];
    const height: any = req.query["height"];
  
    const extension = "jpg";
   
    try {
     
      if (!req.query["width"] || !req.query.height || !req.query.filename ) {
        res
          .status(500)
          .send(
            "Image name, width and height to be resized to needs to be provided"
          );
        return;
      } else if(!fs.existsSync(`${imagesFolder}/${filename}.jpg`)){
          res.status(500).send("The image specified doesn't exist in the image folder");
          return ;
      }
      
  
      fs.stat(`${thumbFolder}/${filename}_${width}_${height}.${extension}`, (err) => {
        if (!err) {
          const readStream = fs.createReadStream(
            `${thumbFolder}/${filename}_${width}_${height}.${extension}`,
            { flags: "r+" }
          );
          readStream.pipe(res);
          return;
        }
  
        if ((err.code = "ENONT")) {
          //check if folder exists otherwise create folder
          if (!fs.existsSync(thumbFolder)) {
            fs.mkdirSync(thumbFolder);
          }
  
          //get the file from the image to process
          const readFileStream = fs.createReadStream(
            `${imagesFolder}/${filename}.jpg`
          );
          readFileStream.on("error", (err: Error) => {
            return res.status(500).send({
              message: err.message
            });
          });
          //using sharp to resize image to the given width and height
          const transform = imageResizer(width, height);
          const cacheFileStream = fs.createWriteStream(
            `${thumbFolder}/${filename}_${width}_${height}.${extension}`,
            { flags: "w+" }
          );
          readFileStream.pipe(transform).pipe(cacheFileStream);
  
          cacheFileStream.on("finish", () => {
            const readStream = fs.createReadStream(
              `${thumbFolder}/${filename}_${width}_${height}.${extension}`,
              { flags: "r+" }
            )
            return readStream.pipe(res);
          });
        }
      });
    } catch (error) {
      return res.status(500).send({
        message: "File name and reduction sizes must be provided",
        err: error
      });
    }
  };

  async imageExist (filename:string, width:number, height:number){
    if(fs.existsSync(`${imagesFolder}/${filename}.jpg`)){
      return `${imagesFolder}/${filename}.jpg` ;
  }
  }

  async reducedImageExist(filename:string, width:number, height:number){
    if(fs.existsSync(`${thumbFolder}/${filename}_${width}_${height}.jpg`)){
      return `${thumbFolder}/${filename}_${width}_${height}.jpg` ;
  }
  }

};

