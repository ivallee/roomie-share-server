const { validateUser } = require('../../utils');

async function newExpense(parent, args, ctx, info) {
  const { groupId, amount, description, participants } = args;
  const userId = validateUser(ctx);
  // const group = await ctx.db.query.group({ where: { id: groupId } });
  console.log('PARTICIPANTS!!!!! ', participants);

  const participantShares = participants.map((p) => {
    return { 
      share: p.share,
      userId: { connect: { id: p.user } } }
  });

  console.log('EXPENSESHAREEEEEEEE ', participantShares);
    
  return ctx.db.mutation.createExpense({
      data: {
        amount,
        description,
        paidBy: { connect: { id: userId } },
        group: { connect: { id: groupId } },
        participants: { create: participantShares }
        // sharedBy: { connect: sharedBy }
      }
    },
      info
    );
  
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