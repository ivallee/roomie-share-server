const entryMutations = require('./entry-mutation-resolvers');
const groupMutations = require('./group-mutation-resolvers');


module.exports = {
  ...entryMutations,
  ...groupMutations
}