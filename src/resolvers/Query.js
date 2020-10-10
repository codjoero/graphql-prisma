import { getUserId } from "../utils"

const Query = {
  users: async (parent, args, { prisma }, info) => {
    const  where = {
      OR: [{
        name: { contains: args.filter }
      }]
    }
    return await prisma.user.findMany({
      where,
      skip: args.skip,
      take: args.take,
      orderBy: args.orderBy
    })
  },
  me: async (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request)

    return prisma.user.findOne({
      where: { id: userId }
    })
  },
  posts: async (parent, args, { prisma,request }, info) => {
    const where = {
        OR: [
          { title: { contains: args.filter } },
          { body: { contains: args.filter } }
        ],
      }
    const posts = await prisma.post.findMany({
      where,
      skip: args.skip,
      take: args.take,
      orderBy: args.orderBy
    })

    const count = prisma.post.count()
    
    return {
      posts,
      count
    }
  },
  myPosts: async (parent, args, { prisma,request }, info) => {
    const userId = getUserId(request)

    const where = {
      authorId: userId,
      OR: [
        { title: { contains: args.filter, mode: "insensitive" } },
        { body: { contains: args.filter, mode: "insensitive" } }
      ],
    }
    const posts = await prisma.post.findMany({
      where,
      skip: args.skip,
      take: args.take,
      orderBy: args.orderBy
    })

    const count = prisma.post.count({ where })
    
    return {
      posts,
      count
    }
  },
  post: async (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request, false)

    const [post] = await prisma.post.findMany({
      where: {
        id: args.id,
        OR: [{ published: true }, { authorId: userId }]
      }
    })

    if (!post) throw new Error('Post not found')

    return post
  },
  comments(parent, args, { prisma }, info) {
    return prisma.comment.findMany()
  }
}

export {Query as default}
