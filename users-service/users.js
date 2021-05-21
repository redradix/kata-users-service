const getDb = require("./db");

const findUserByUsername = async (username) => {
  const db = await getDb();

  return await db
    .collection("users")
    .findOne({ username: { $eq: username } });
}

const createUser = async (username) => {
  const db = await getDb();

  return await db.collection("users").insertOne({ username });
}

module.exports = {
  findUserByUsername,
  createUser,
}
