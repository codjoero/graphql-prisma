import { getUserId } from '../utils';

const User = {
  email: (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request, false)
 
    if (userId && userId === parent.id) {
      return parent.email
    } else {
      return null
    }
  },
  posts: (parent, args, { prisma }, info) => {
    return prisma.user.findOne({
      where: { id: parent.id }
    }).posts({
      where: {
        published: true
      }
    })
  },
  comments: (parent, args, { prisma }, info) => {
    return prisma.user.findOne({ where: { id: parent.id } }).comments()
  }
}

export { User as default }
