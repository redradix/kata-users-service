const findUserByUsername = async (connection, username) => {
  const db = connection.getDb();

  return await db
    .collection("users")
    .findOne({ username: { $eq: username } });
}

const createUser = async (connection, username) => {
  const db = connection.getDb();

  return await db.collection("users").insertOne({ username });
}

module.exports = {
  findUserByUsername,
  createUser,
}
