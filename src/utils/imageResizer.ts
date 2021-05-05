import sharp from "sharp";

export const imageResizer  = (width : string, height : string) =>{
    return sharp().resize(parseInt(width), parseInt(height));
}

