const express = require("express");
const bodyParser = require("body-parser");

const getDb = require("./db");

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

app.post("/users", async (req, res) => {
  const username = req.body.username

  if (!username) {
    return res
      .status(400)
      .json({ errors: ["username is not provided"] });
  }

  const db = await getDb();

  const foundUser = await db.collection("users").findOne({ username: { $eq: username } });
  if (foundUser) {
    return res
      .status(400)
      .json({ errors: ["username already in use"] });
  }

  await db
    .collection("users")
    .insertOne({ username });

  return res.status(200).end();
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
