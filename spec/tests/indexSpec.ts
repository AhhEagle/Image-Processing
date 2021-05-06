import { app } from "../../src/index";
import request from "supertest";
const req = request(app);

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
});
