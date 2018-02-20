const { validateUser, calculatePerPerson } = require('../../utils');

async function newExpense(parent, args, ctx, info) {
  const { groupId, amount, description, participants } = args;
  const userId = validateUser(ctx);
  const participantShares = [];

  const validateCreator = await ctx.db.exists.Group({
    id: groupId,
    users_some: {
      id: userId
    }
  });

  if (!validateCreator) {
    throw new Error('You cannot add expenses to a group you do not belong to.');
  }


  const newParticipants = participants.map((p) => {
    participantShares.push(p.share);
    return {
      share: p.share,
      user: { connect: { id: p.userId } }
    }
  });

  const perPerson = calculatePerPerson(amount, participantShares);

  return ctx.db.mutation.createExpense({
    data: {
      amount,
      description,
      paidBy: { connect: { id: userId } },
      group: { connect: { id: groupId } },
      participants: { create: newParticipants },
      perPerson
    }
  },
    info
  )
}

module.exports = {
  newExpense
}