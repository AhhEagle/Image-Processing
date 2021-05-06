import { app } from "../../src/index";
import request from "supertest";
import { ImageReduction } from "../../src/controller";
const req = request(app);

const check = new ImageReduction();
const filename = "fjord";
const width = 200;
const height = 200;
const image = "images";
const thumbFolder = "thumb";

describe("response on calling endpoint", () => {
  it("should return status 200", async () => {
    const response = await req
      .get("/api/images/?filename=fjord&width=200&height=800")
      .send();
    expect(response.status).toBe(200);
  });

  it("should return status 500", async () => {
    const response = await req.get("/api/images").send();
    expect(response.status).toBe(500);
    expect(response.text).toBe(
      "Image name, width and height to be resized to needs to be provided"
    );
  });

  it("should check if image exist in the image folder", async () => {
    expect(await check.imageExist(filename, width, height)).toBe(
      `${image}/${filename}.jpg`
    );
  });

  it("should check if the image was reduced to specified width and height", async () => {
    expect(await check.reducedImageExist(filename, width, height)).toEqual(
      `${thumbFolder}/${filename}_${width}_${height}.jpg`
    );
  });
});
