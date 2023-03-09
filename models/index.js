const { Show } = require('./Show')
const { User } = require('./User')

Show.belongsToMany(User, {through: "users_shows"})
User.belongsToMany(Show, {through: "users_shows"})

module.exports = {Show, User}
