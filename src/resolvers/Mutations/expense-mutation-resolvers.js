const { validateUser, calculatePerPerson, validateGroupMembership } = require('../../utils');

async function newExpense(parent, args, ctx, info) {
  const { groupId, amount, description, participants } = args;
  const userId = validateUser(ctx);
  const participantShares = [];

  const validateCreator = await validateGroupMembership(ctx, userId, groupId);

  if (!validateCreator) {
    throw new Error('You cannot add expenses to a group you do not belong to.');
  }

  for (let p of participants) {
    const validateParticipant = await validateGroupMembership(ctx, p.userId, groupId);
    if (!validateParticipant) {
      throw new Error(`User ${p.userId} is not a member of this group`)
    }
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