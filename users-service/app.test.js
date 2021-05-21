const request = require("supertest");

const { makeApp } = require("./app");
const { connect } = require("./db");
const createUsersService = require("./users")

const MOCK_USER = {
  username: "john",
  email: 'john@example.com',
  password: 'password'
}

describe('Users api', () => {
  let connection, usersService, app

  beforeAll(async () => {
    connection = await connect()
    usersService = createUsersService(connection)
    app = makeApp(usersService)
  })

  afterEach(async () => {
    await connection.getDb().collection("users").removeMany({});
  });

  afterAll(async () => {
    await connection.close()
  })

  describe('create', () => {
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
      expect(json.errors).toEqual(
        expect.arrayContaining(["username is not provided"])
      );
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
      expect(json.errors).toEqual(
        expect.arrayContaining(["username already in use"])
      );
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
      expect(json.errors).toEqual(
        expect.arrayContaining(["email not valid"])
      );
    });

    it("fails if password length is less than 8 characters", async () => {
      const res = await request(app)
        .post("/users")
        .send({
          ...MOCK_USER,
          password: 'pass',
        });

      const { status, text } = res;
      const json = JSON.parse(text);

      expect(status).toEqual(400);
      expect(json.errors).toEqual(
        expect.arrayContaining(["password must have 8 or more characters"])
      );
    });

    it("returns all applicable errors if many happen in parallel", async () => {
      const res = await request(app)
        .post("/users")
        .send({
          email: 'not an email',
          password: 'lol',
        });

      const { status, text } = res;
      const json = JSON.parse(text);

      expect(status).toEqual(400);
      expect(json.errors).toHaveLength(3)
      expect(json.errors).toEqual(
          expect.arrayContaining([
            "username is not provided",
            "email not valid",
            "password must have 8 or more characters",
          ])
        );
    });

  })

  describe('list', () => {
    it('retrieves users', async () => {
      {
        const { status } = await request(app).post('/users').send({
          username: 'john',
          email: 'john@email.com',
          password: 'abcdefgh'
        })
        expect(status).toEqual(200)
      }

      {
        const { status } = await request(app).post('/users').send({
          username: 'mary',
          email: 'mary@email.com',
          password: 'abcdefgh'
        })
        expect(status).toEqual(200)
      }

      const { status, text } = await request(app).get('/users')
      const users = JSON.parse(text)

      expect(status).toEqual(200)
      expect(users).toEqual(expect.arrayContaining([
        { username: 'john', email: 'john@email.com' },
        { username: 'mary', email: 'mary@email.com' },
      ]))
    })
  })

});
