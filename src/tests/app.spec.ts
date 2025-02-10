import request from "supertest";

import app from "../app";

describe("GET /", () => {
  it("should return 200 OK with the correct message", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Welcome to Node.js Express.js with TypeScript",
    });
  });
});
