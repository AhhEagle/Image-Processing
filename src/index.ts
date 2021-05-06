import express from "express";
import { imageReducer } from "./controller";

export const app: express.Application = express();

const PORT: number = 3000;

app.get("/api/images", imageReducer);

app.listen(PORT, () => {
  console.log(`Server is listening on Port: ${PORT}`);
});
