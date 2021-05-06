"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageResizer = void 0;
var sharp_1 = __importDefault(require("sharp"));
var imageResizer = function (width, height) {
    return sharp_1.default().resize(parseInt(width), parseInt(height));
};
exports.imageResizer = imageResizer;
