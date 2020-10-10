import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'
import { getUserId, generateToken, hashPassword } from '../utils'

const Mutation = {
  createUser: async (parent, args, { prisma }, info) => {
    const emailTaken = await prisma.user.findOne({
      where: { email: args.data.email}
    })

    if (emailTaken) throw new Error('Email taken.')

    const password = await hashPassword(args.data.password)
    const user = await prisma.user.create({ data: { ...args.data, password } })

    return {
      user,
      token: generateToken(user.id)
    }
  },
  login: async (parent, args, { prisma }, info) => {
    const user = await prisma.user.findOne({ where: { email: args.data.email } })
    if (!user) throw new Error('Invalid email or password')

    const valid = await bcrypt.compare(args.data.password, user.password)
    if (!valid) throw new Error('Invalid email or password')

    return {
      user,
      token: generateToken(user.id)
    }
  },
  deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.user.delete({
      where: { id: userId}
    })
  }, 
  updateUser: async (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request)

    if (typeof args.data.password === 'string') {
      args.data.password = await hashPassword(args.data.password)
    }

    return prisma.user.update({
      where: { id: userId },
      data: args.data
    }, info)
  },
  createPost: (parent, args, { prisma, request, pubsub }, info) => {
    const userId = getUserId(request)
  
    const post = prisma.post.create({
      data: {
        ...args.data,
        author: { connect: {id: userId}}
      }
    })

    if (args.data.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post
        }
      })
    }

    return post
  },
  deletePost: async(parent, args, { prisma, request, pubsub }, info) => {
    const userId = getUserId(request)

    const [ post ] = await prisma.post.findMany({
      where: {
        AND: [
          { id: Number(args.id) },
          { authorId: userId }
        ]
      }
    })

    console.log('post :>> ', post);

    if (!post) throw Error('Unable to delete post')

    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post
        }
      })
    }

    return prisma.post.delete({
      where: { id: post.id}
    })
  },
  updatePost: async (parent, args, { prisma, request, pubsub }, info) => {
    const userId = getUserId(request)

    const { id, data } = args
    const postExists = await prisma.post.findMany({
      where: {
        AND: [{ id: Number(id) }, { authorId: userId }]
      }
    })

    if (!postExists[0]) throw Error('Unable to update post')

    const originalPost = { ...postExists[0] }
    console.log('originalPost :>> ', originalPost);
    if (typeof data.published === 'boolean') {

      if (originalPost.published && !data.published) {
        const removed = await prisma.comment.deleteMany({
          where: { postId: id }
        })
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost
          }
        })
      } else if (!originalPost.published && data.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: { ...originalPost, ...data}
          }
        })
      }
    } else if (originalPost.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: { ...originalPost, ...data}
        }
      })
    }

    return prisma.post.update({
      where: { id: Number(id) },
      data: { ...data }
    })
  },
  createComment: async (parent, args, { prisma, request, pubsub }, info) => {
    const userId = getUserId(request)

    const post = await prisma.post.findOne({
      where: { id: args.data.post }
    })
    if (!post || !post.published) throw new Error('Unable to find post')
    const comment = prisma.comment.create({
      data: {
        text: args.data.text,
        author: { connect: { id: userId } },
        post: { connect: { id: args.data.post } },
      },
    });

    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment,
      },
    });

    return comment
  },
  deleteComment: async (parent, args, { prisma, request, pubsub }, info) => {
    const userId = getUserId(request)

    const [commentExists] = await prisma.comment.findMany({
      where: {
        AND: [{ id: args.id }, { authorId: userId }]
      }
    })
  
    if (!commentExists) throw new Error('Unable to delete comment')

    const comment = prisma.comment.delete({
      where: { id: args.id }
    })

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: comment
      }
    })

    return comment
  },
  updateComment: async (parent, args, { prisma, request, pubsub }, info) => {
    const userId = getUserId(request)

    const [commentExists] = await prisma.comment.findMany({
      where: {
        AND: [{ id: args.id }, { authorId: userId }]
      }
    })
  
    if (!commentExists) throw new Error('Unable to update comment')

    const comment = prisma.comment.update({
      where: { id: args.id },
      data: args.data
    })

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    })

    return comment
  },
  vote: async (parent, args, { prisma, request, pubsub }, info) => {
    const userId = getUserId(request)

    const vote = await prisma.vote.findOne({
      where: {
        postId_userId: {
          postId: Number(args.postId),
          userId: userId
        }
      }
    })

    if (Boolean(vote)) throw new Error(`Already voted for post: ${args.postId}`)

    const newVote = prisma.vote.create({
      data: {
        user: { connect: { id: userId } },
        post: { connect: { id: Number(args.postId)}}
      }
    })
    pubsub.publish('vote', {
      vote: {
        mutation: 'CREATED',
        data: newVote
      }
    })

    return newVote
  }
}

export {Mutation as default}
