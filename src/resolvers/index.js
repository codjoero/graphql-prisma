import Query from './Query'
import Mutation from './Mutation'
import Subscription from './Subscription'
import User from './User'
import Post from './Post'
import Comment from './Comment'
import Vote from './Vote'

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Post,
  Comment,
  Vote
}

export { resolvers }
