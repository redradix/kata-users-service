function createUsersService(connection) {

  const findUserByUsername = async (username) => {
    const db = connection.getDb();

    return await db
      .collection("users")
      .findOne({ username: { $eq: username } });
  }

  const createUser = async ({ username, email }) => {
    const db = connection.getDb();

    return await db.collection("users").insertOne({ username, email });
  }

  const getAll = async () => {
    const db = connection.getDb()

    const users = await db.collection("users").find({}).toArray()
    return users.map(({ username, email }) => ({ username, email }))
  }

  return {
    findUserByUsername,
    createUser,
    getAll,
  }
}

module.exports = createUsersService
