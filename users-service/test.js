const request = require("supertest");

const app = require("./api");
const getDb = require("./db");

const MOCK_USER = {
  username: "john",
  email: 'john@example.com',
}

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

  describe('user creation', () => {
    it("create a new user", async () => {
      const res = await request(app)
        .post("/users")
        .send(MOCK_USER);

      const { status, text } = res;
      const json = JSON.parse(text);

      expect(status).toEqual(200);
      expect(json.id).toBeDefined();
      expect(json.message).toEqual("user created");
    });

    it("fails if username is not provided", async () => {
      const res = await request(app).post("/users");

      const { status, text } = res;

      const json = JSON.parse(text);

      expect(status).toEqual(400);
      expect(json.errors).toEqual(["username is not provided"]);
    });

    it("fails if username is already in use", async () => {
      await request(app)
        .post("/users")
        .send(MOCK_USER);

      const res = await request(app)
        .post("/users")
        .send(MOCK_USER);

      const { status, text } = res;
      const json = JSON.parse(text);

      expect(status).toEqual(400);
      expect(json.errors).toEqual(["username already in use"]);
    });

    it("fails if email format is not valid", async () => {
      const res = await request(app)
        .post("/users")
        .send({
          ...MOCK_USER,
          email: 'bademail',
        });

      const { status, text } = res;
      const json = JSON.parse(text);

      expect(status).toEqual(400);
      expect(json.errors).toEqual(["email not valid"]);
    });
  });
});
