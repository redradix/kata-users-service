const express = require("express");
const bodyParser = require("body-parser");

const getDb = require("./db");

const {
  findUserByUsername,
  createUser,
} = require('./users')

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  return res.json({ message: "aupa ahi" });
});

app.get("/samples", async (req, res) => {
  console.log("GET /samples");

  const db = await getDb();
  const cursor = db.collection("samples").find();
  const items = await cursor.toArray();
  return res.json({ items });
});

app.post("/samples", async (req, res) => {
  console.log("POST /samples", req.body);

  const db = await getDb();
  const { insertedCount, insertedId, result } = await db
    .collection("samples")
    .insertOne(req.body);
  return res.json({ insertedCount, insertedId, result });
});

const REGEX_CHECK_EMAIL = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

app.post("/users", async (req, res) => {
  const { username, email, password } = req.body;

  const errors = [
    !username && "username is not provided",
    !email && "email is not provided",
    email && !REGEX_CHECK_EMAIL.test(email) && "email not valid",
    (!password || password.length < 8) && "password must have 8 or more characters",
  ].filter(x => x !== false)

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const foundUser = await findUserByUsername(username);

  if (foundUser) {
    return res.status(400).json({ errors: ["username already in use"] });
  }

  const { insertedId } = await createUser(username);

  return res.status(200).json({ message: "user created", id: insertedId });
});

app.delete("/samples", async (req, res) => {
  console.log("DELETE /samples");

  const db = await getDb();
  const { deletedCount, result } = await db
    .collection("samples")
    .deleteMany({});

  return res.json({ deletedCount, result });
});

module.exports = app;
