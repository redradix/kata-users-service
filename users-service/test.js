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

  it("POST /users works if username is provided", async () => {
    const res = await request(app).post("/users")
      .send({ username: 'john' });

    const { status } = res;

    expect(status).toEqual(200);
  });

  it("POST /users fails if username is not provided", async () => {
    const res = await request(app).post("/users");

    const { status, text } = res;

    const json = JSON.parse(text)

    expect(status).toEqual(400);
    expect(json.errors).toEqual(["username is not provided"])
  });

  it("POST /users fails if username is already in use", async () => {
    await request(app).post("/users")
      .send({ username: 'john' });
    const res = await request(app).post("/users")
      .send({ username: 'john' });
    const { status, text } = res;
    const json = JSON.parse(text)
    expect(status).toEqual(400);
    expect(json.errors).toEqual(["username already in use"])
  });
});
