const { GraphQLServer, PubSub } = require('graphql-yoga')
const { PrismaClient } = require('@prisma/client')
import db from './db'
import { resolvers } from './resolvers/index'

const prisma = new PrismaClient()
const pubsub = new PubSub()

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: request => ({
    ...request,
    db,
    prisma,
    pubsub
  })
})

server.start(() => {
  console.log('Server is running 🚀');
})
