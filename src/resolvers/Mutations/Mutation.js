const entryMutations = require('./entry-mutation-resolvers');
const groupMutations = require('./group-mutation-resolvers');
const expenseMutations = require('./expense-mutation-resolvers');


module.exports = {
  ...entryMutations,
  ...groupMutations,
  ...expenseMutations
}