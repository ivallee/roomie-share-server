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

  const totalPaid = [];
  expenses.forEach((e) => {
    if (e.paidBy.id === userId) {
      totalPaid.push(e.amount);
    }
  });
  totalPaid = totalPaid.reduce((acc, curr) => acc + curr);

  

  console.log('DAATTTAAAAAA', expenses[0].participants, expenses[0].paidBy);
  console.log("AAAAAMAOUUUUNT ", totalPaid.reduce((acc, curr) => acc + curr) )

  // figure out which ones user paid for

  // function to calculate total paid

  // function to calculate total owed

  // TODO: add check to see if expense has been "paid"


  return {
    // userId
    // group
    // total paid
    // total owed
  }
}

module.exports = {
  balance
}