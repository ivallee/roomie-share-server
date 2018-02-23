const balanceMutations = require('./balance-query-resolvers');

function allUsers(parent, args, ctx, info) {
  return ctx.db.query.users({}, info);
}

function getUserById(parent, args, ctx, info) {
  const { userId } = args;

  return ctx.db.query.user({ where: { id: userId } }, info);
}

function getUserByEmail(parent, args, ctx, info) {
  const { email } = args;

  return ctx.db.query.user({ where: { email } }, info);
}

function allGroups(parent, args, ctx, info) {
  return ctx.db.query.groups({}, info);
}

module.exports = {
  allUsers,
  allGroups,
  getUserById,
  getUserByEmail,
  ...balanceMutations
}