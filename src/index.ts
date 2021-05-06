import express from "express";
import { ImageReduction } from "./controller";

const imageReducer = new ImageReduction();

export const app: express.Application = express();

const PORT: number = 3000;

app.get("/api/images", imageReducer.imageReducer);

app.listen(PORT, () => {
  console.log(`Server is listening on Port: ${PORT}`);
});
