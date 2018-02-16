function allUsers(parent, args, ctx, info) {
  return ctx.db.query.users({}, info)
}

module.exports = {
  allUsers
}