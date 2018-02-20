require('dotenv').config();
const APP_SECRET = process.env.APP_SECRET;
const jwt = require('jsonwebtoken');

const validateUser = (context) => {
  const Authorization = context.request.get('Authorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, APP_SECRET);
    return userId;
  }

  throw new Error('Not authenticated');
};

const calculatePerPerson = (expense, shares) => {
  const sum = shares.reduce((acc, curr) => acc + curr);

  return expense / sum;
};

const validateGroupMembership = async function(context, userId, groupId) {
  isValid = await context.db.exists.Group({
    id: groupId,
    users_some: {
      id: userId
    }
  });
  return isValid
};


module.exports = {
  APP_SECRET,
  validateUser,
  calculatePerPerson,
  validateGroupMembership
}