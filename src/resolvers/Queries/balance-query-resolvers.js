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
        console.log(sumProduct);
        totalOwed += sumProduct;
      }
    });
  });
  totalPaid = totalPaid.reduce((acc, curr) => acc + curr);



  console.log('DAATTTAAAAAA', expenses[0].participants, expenses[0].paidBy);
  console.log("AAAAAMAOUUUUNT ", totalPaid, totalOwed)

  // figure out which ones user paid for

  // function to calculate total paid

  // function to calculate total owed

  // TODO: add check to see if expense has been "paid"?


  return {
    totalPaid,
    totalOwed,
    balance: totalPaid - totalOwed
  }
}

module.exports = {
  balance
}