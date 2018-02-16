require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function signup(parent, args, ctx, info) {
  const password = await bcrypt.hash(args.password, 10);
  console.log('I MADE IT THSI FARRRRRRR', password)
  const user = await ctx.db.mutation.createUser({
    data: { ...args, password }
  });

  console.log('PASSWORD: ', password)
  console.log('USER: ', user)
  const token = jwt.sign({ userId: user.id}, process.env.APP_SECRET);

  return {
    token,
    user
  }
}

module.exports = {
  signup
}