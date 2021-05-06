import { Request, Response } from "express";
import fs, { promises as fsPromises } from "fs";
import { imageResizer } from "../utils/imageResizer";

const thumbFolder = "thumb";

const imagesFolder = "images";

export const imageReducer = (req: Request, res: Response) => {
  try {
    //get filename, width and height from the query 
    const filename: any = req.query["filename"];
    const width: any = req.query["width"];
    const height: any = req.query["height"];
    const name = filename.split(".")[0];
    const extension = "jpg";
    fs.stat(`${thumbFolder}/${name}_${width}_${height}.${extension}`, (err) => {
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
          `${thumbFolder}/${name}_${width}_${height}.${extension}`,
          { flags: "w+" }
        );
        readFileStream.pipe(transform).pipe(cacheFileStream);

        cacheFileStream.on("finish", () => {
          const readStream = fs.createReadStream(
            `${thumbFolder}/${name}_${width}_${height}.${extension}`,
            { flags: "r+" }
          );
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
