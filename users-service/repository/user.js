const UserRepository = (db) => ({
  getUserByUsername: (username) => db.collection('users').findOne({ username }),
  create: (user) => db.collection('users').insertOne(user),
})

module.exports = UserRepository
