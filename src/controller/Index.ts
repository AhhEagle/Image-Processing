import {Request, Response} from "express";
import fs, { promises as fsPromises } from "fs";
import { imageResizer } from "../utils/imageResizer";

const thumbFolder = "thumb";

const imagesFolder = "images";

export const imageReducer = (req : Request, res: Response) => {
    try {
      const filename: any = req.query["filename"];
      const width: any = req.query["width"];
      const height: any = req.query["height"];
      const name = filename.split(".")[0];
      const extension = "jpg";
      fs.stat(
       `${thumbFolder}/${name}_${width}_${height}.${extension}`,
        (err, stats) => {
          console.log(err);
          if (!err) {
            const readStream = fs.createReadStream(
              `${thumbFolder}/${name}_${width}_${height}.${extension}`,
              { flags: "r+" }
            );
            readStream.pipe(res);
            return;
          }
  
          if ((err.code = "ENONT")) {
            if (!fs.existsSync(thumbFolder)) {
              fs.mkdirSync(thumbFolder);
            }
            const readFileStream = fs.createReadStream(
              `${imagesFolder}/${filename}.jpg`
            );
            readFileStream.on("error", (err: Error) => {
              return res.status(500).send({
                message: err.message,
              });
            });
            const transform = imageResizer(width, height);
            const cacheFileStream = fs.createWriteStream(
              `${thumbFolder}/${name}_${width}_${height}.${extension}`,
              { flags: "w+" }
            );
            readFileStream.pipe(transform).pipe(cacheFileStream);
  
            cacheFileStream.on("finish", () => {
              const readStream = fs.createReadStream(
                `${thumbFolder}/${name}_${width}_${height}.${extension}`,
                { flags: "r+" }
              );
              readStream.pipe(res);
            });
          }
        }
      );
     
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "File name and reduction sizes must be provided", err: error  });
    }
  }

