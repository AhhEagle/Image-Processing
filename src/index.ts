import express from "express";
import { imageReducer } from "./controller/Index";
const app: express.Application = express();

const PORT: number = 3000;


app.get("/api/images", imageReducer );

app.listen(PORT, () => {
  console.log(`Server is listeneing on Port: ${PORT}`);
});
