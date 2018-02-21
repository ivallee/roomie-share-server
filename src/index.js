require('dotenv').config();

const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');

// import Resolvers
const Query = require('./resolvers/Queries/Query');
const Mutation = require('./resolvers/mutations/Mutation');

const resolvers = {
  Query,
  Mutation
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'http://localhost:4466/server/dev', 
      secret: process.env.PRISMA_SECRET,
      debug: true, 
    }),
  }),
})

server.start(() => console.log('Server is running on http://localhost:4000'))
