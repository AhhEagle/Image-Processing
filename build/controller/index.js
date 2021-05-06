"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageReducer = void 0;
var fs_1 = __importDefault(require("fs"));
var imageResizer_1 = require("../utils/imageResizer");
var thumbFolder = "thumb";
var imagesFolder = "images";
var imageReducer = function (req, res) {
    try {
        //get filename, width and height from the query 
        var filename_1 = req.query["filename"];
        var width_1 = req.query["width"];
        var height_1 = req.query["height"];
        var name_1 = filename_1.split(".")[0];
        var extension_1 = "jpg";
        fs_1.default.stat(thumbFolder + "/" + name_1 + "_" + width_1 + "_" + height_1 + "." + extension_1, function (err) {
            console.log(err);
            if (!err) {
                var readStream = fs_1.default.createReadStream(thumbFolder + "/" + name_1 + "_" + width_1 + "_" + height_1 + "." + extension_1, { flags: "r+" });
                readStream.pipe(res);
                return;
            }
            if ((err.code = "ENONT")) {
                //check if folder exists otherwise create folder
                if (!fs_1.default.existsSync(thumbFolder)) {
                    fs_1.default.mkdirSync(thumbFolder);
                }
                //get the file from the image to process
                var readFileStream = fs_1.default.createReadStream(imagesFolder + "/" + filename_1 + ".jpg");
                readFileStream.on("error", function (err) {
                    return res.status(500).send({
                        message: err.message
                    });
                });
                //using sharp to resize image to the given width and height
                var transform = imageResizer_1.imageResizer(width_1, height_1);
                var cacheFileStream = fs_1.default.createWriteStream(thumbFolder + "/" + name_1 + "_" + width_1 + "_" + height_1 + "." + extension_1, { flags: "w+" });
                readFileStream.pipe(transform).pipe(cacheFileStream);
                cacheFileStream.on("finish", function () {
                    var readStream = fs_1.default.createReadStream(thumbFolder + "/" + name_1 + "_" + width_1 + "_" + height_1 + "." + extension_1, { flags: "r+" });
                    return readStream.pipe(res);
                });
            }
        });
    }
    catch (error) {
        return res.status(500).send({
            message: "File name and reduction sizes must be provided",
            err: error
        });
    }
};
exports.imageReducer = imageReducer;
