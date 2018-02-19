const { validateUser } = require('../../utils');

function newGroup(parent, args, ctx, info) {
  const { name } = args;
  const id = validateUser(ctx);

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
  const authorized = validateUser(ctx);
  const user = await ctx.db.query.user({ where: { email } }, '{id groups { id }}');
  const groupExists = await ctx.db.exists.Group({ id: groupId });

  if (!user) {
    throw new Error(`Could not find user with Email: ${email}`);
  }
  if (!groupExists) {
    throw new Error(`Could not find group with ID: ${groupId}`);
  }
  if (user.groups.find(e => e.id === groupId)) {
    throw new Error(`${email} is already a member of this group`);
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

async function removeFromGroup(parent, args, ctx, info) {
  const { email, groupId } = args;
  const userId = validateUser(ctx);
  const group = await ctx.db.exists.Group({
    id: groupId,
    createdBy: {
      id: userId
    }
  });

  // TODO
  // add check to see if user is settled up before being able to leave

  if (!group) {
    throw new Error('Only group creators may remove users');
  }

  return ctx.db.mutation.updateGroup({
    where: { id: groupId },
    data: {
      users: { disconnect: { email } }
    }
  },
    info
  )
}

async function leaveGroup(parent, args, ctx, info) {
  const { groupId } = args;
  const id = validateUser(ctx);
  const user = await ctx.db.query.user({ where: { id } }, '{id groups { id }}');

  // TODO
  // add check to see if user is settled up before being able to leave
  return ctx.db.mutation.updateGroup({
    where: { id: groupId },
    data: {
      users: { disconnect: { id: user.id } }
    }
  },
    info
  )
}

module.exports = {
  newGroup,
  addToGroup,
  removeFromGroup,
  leaveGroup
}