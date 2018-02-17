const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { APP_SECRET, getUserId } = require('../utils');

async function signup(parent, args, ctx, info) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await ctx.db.mutation.createUser({
    data: { ...args, password }
  });

  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

  return {
    token,
    user
  }
}

async function login(parent, args, ctx, info) {
  const user = await ctx.db.query.user({ where: { email: args.email } });

  if (!user) {
    throw new Error(`Could not find a user with email: ${args.email}`);
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error('Invalid login');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  }
}

function newGroup(parent, args, ctx, info) {
  const { name } = args;
  const id = getUserId(ctx);

  return ctx.db.mutation.createGroup({
    data: {
      name,
      users: { connect: { id } },
      createdBy: { connect: { id } }
    }
  },
    info
  )
}

async function addToGroup(parent, args, ctx, info) {
  const { email, groupId } = args;
  const authorized = getUserId(ctx);
  const user = await ctx.db.query.user({ where: { email }}, '{id groups { id }}' );
  const groupExists = await ctx.db.exists.Group({ id: groupId });

  if (!user) {
    throw new Error(`Could not find user with Email: ${email}`);
  }
  if (!groupExists) {
    throw new Error(`Could not find group with ID: ${groupId}`);
  }
  if (user.groups.find(e => e.id === groupId)) {
    throw new Error(`${email} is already a member of group: ${groupId}`);
  }

  // TODO turn into invite? add notification for added user?
  return ctx.db.mutation.updateGroup({
    where: { id: groupId },
    data: {
      users: { connect: { id: user.id } }
    }
  },
    info
  )
}

module.exports = {
  signup,
  login,
  newGroup,
  addToGroup
}