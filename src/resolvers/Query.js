function allUsers(parent, args, ctx, info) {
  return ctx.db.query.users({}, info)
}

function allGroups(parent, args, ctx, info) {
  return ctx.db.query.groups({}, info)
}

module.exports = {
  allUsers,
  allGroups
}