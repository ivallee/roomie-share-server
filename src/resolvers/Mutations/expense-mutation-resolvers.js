const { validateUser } = require('../../utils');

async function newExpense(parent, args, ctx, info) {
  const { groupId, amount, description } = args;
  const userId = validateUser(ctx);
  const group = await ctx.db.query.group({where: { id: groupId } });
  // console.log('SHARED BY: ', sharedBy)

  
  return ctx.db.mutation.createExpense({
    data: {
      amount,
      description,
      postedBy: { connect: { id: userId } },
      group: { connect: { id: groupId } }
      // sharedBy: { connect: sharedBy }
      }
    },
    info
  )
}

module.exports = {
  newExpense
}