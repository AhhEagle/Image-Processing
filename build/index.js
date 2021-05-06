"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var express_1 = __importDefault(require("express"));
var controller_1 = require("./controller");
exports.app = express_1.default();
var PORT = 3000;
exports.app.get("/api/images", controller_1.imageReducer);
exports.app.listen(PORT, function () {
    console.log("Server is listening on Port: " + PORT);
});
