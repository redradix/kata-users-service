const UserRepository = (db) => ({
  getUserByUsername: (username) => db.collection('users').findOne({ username })
})

module.exports = UserRepository
