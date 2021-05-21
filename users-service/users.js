const findUserByUsername = async (dataLayer, username) => {
  const db = dataLayer.getDb();

  return await db
    .collection("users")
    .findOne({ username: { $eq: username } });
}

const createUser = async (dataLayer, username) => {
  const db = dataLayer.getDb();

  return await db.collection("users").insertOne({ username });
}

module.exports = {
  findUserByUsername,
  createUser,
}
