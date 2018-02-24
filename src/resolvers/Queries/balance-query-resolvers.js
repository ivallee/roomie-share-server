const { validateUser, validateGroupMembership } = require('../../utils');

async function balance(parent, args, ctx, info) {
  const { groupId } = args;
  const userId = validateUser(ctx);

  const expenses = await ctx.db.query.expenses({
    where: {
      group: { id: groupId }
    }
  }, `{ 
        id 
        description
        amount
        perPerson
        paidBy {
          id
          name
        } 
        participants {
          user {
            name 
            id
          }
          share 
        } 
      }`
    );

  let totalPaid = [];
  let totalOwed = 0;
  
  expenses.forEach((e) => {
    if (e.paidBy.id === userId) {
      totalPaid.push(e.amount);
    }
    
    e.participants.forEach((p) => {
      if (p.user.id === userId) {
        const sumProduct = p.share * e.perPerson;
        totalOwed += sumProduct;
      }
    });
  });
  totalPaid = totalPaid.reduce((acc, curr) => acc + curr);

  return {
    userId,
    totalPaid: Math.round(totalPaid),
    totalOwed: Math.round(totalOwed),
    balance: Math.round(totalPaid - totalOwed)
  }
}

module.exports = {
  balance
}