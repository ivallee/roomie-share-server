const { validateUser, calculatePerPerson } = require('../../utils');

async function newExpense(parent, args, ctx, info) {
  const { groupId, amount, description, participants } = args;
  const userId = validateUser(ctx);
  // const group = await ctx.db.query.group({ where: { id: groupId } });
  console.log('PARTICIPANTS!!!!! ', participants);

  const participantShares = [];
  
  const newParticipants = participants.map((p) => {
    participantShares.push(p.share);
    return { 
      share: p.share,
      user: { connect: { id: p.userId } } }
  });
  
  console.log('USSEEERRRRRRRRRRRRRR ', userId);
  const  perPerson  = calculatePerPerson(amount, participantShares);
  console.log("PERRRRRR RPEEEEERRRRSONNNNN ", perPerson, typeof perPerson)

  
  return ctx.db.mutation.createExpense({
    // where: { id: groupId },
    data: {
        amount,
        description,
        paidBy: { connect: { id: userId } },
        group: { connect: { id: groupId } },
        participants: { create:  newParticipants  },
        perPerson
        // sharedBy: { connect: sharedBy }
      }
    },
      info
    )
  
}






// INCOMING EXPENSE RESOLVER
// Participants = expense share [LIST]
// who paid
// amount

// determine PP cost by taking expense / sum (expense_share.shares)

// if COST OWNER add to their total paid (group balance)

// sum product of (shares, pp costs) adjust total owed for all

// adjust balances

// return applicable data to client




module.exports = {
  newExpense
}