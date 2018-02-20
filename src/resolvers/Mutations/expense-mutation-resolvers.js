const { validateUser } = require('../../utils');

async function newExpense(parent, args, ctx, info) {
  const { groupId, amount, description, participants } = args;
  const userId = validateUser(ctx);
  const group = await ctx.db.query.group({ where: { id: groupId } });

  const expenseShares = await participants.shares.forEach((user) => {
    return ctx.db.mutation.createExpenseShare({
      data: {
        groupId,
        expenseId: user.userId,
        share: user.share
      }
    },
      info
    )
  });
  console.log(espenseShares);
}



  
//   return ctx.db.mutation.createExpense({
//     data: {
//       amount,
//       description,
//       postedBy: { connect: { id: userId } },
//       group: { connect: { id: groupId } }
//       // sharedBy: { connect: sharedBy }
//     }
//   },
//     info
//   )
// }


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