const request = require("supertest");

const app = require("./api");
const getDb = require("./db");

describe("Dummy test", () => {
  afterEach(async () => {
    (await getDb()).collection("users").removeMany({});
  });

  it("GET /", async () => {
    const res = await request(app).get("/");

    const { status, text } = res;

    expect(status).toEqual(200);
    expect(JSON.parse(text)).toEqual({ message: "aupa ahi" });
  });

  it("POST/users works", async () => {
    const res = await request(app).post("/users");

    const { status } = res;

    expect(status).toEqual(200);
  });
});
