function createUsersService(connection) {

  const findUserByUsername = async (username) => {
    const db = connection.getDb();

    return await db
      .collection("users")
      .findOne({ username: { $eq: username } });
  }

  const createUser = async (username) => {
    const db = connection.getDb();

    return await db.collection("users").insertOne({ username });
  }

  return {
    findUserByUsername,
    createUser
  }
}

module.exports = createUsersService
