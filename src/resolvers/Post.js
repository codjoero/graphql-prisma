const Post = {
  author(parent, args, { prisma }, info) {
    return prisma.post.findOne({ where: { id: parent.id }}).author()
  },
  comments(parent, args, { prisma }, info) {
    return prisma.post.findOne({ where: { id: parent.id }}).comments()
  },
  votes(parent, args, { prisma }, info) {
    return prisma.post.findOne({ where: { id: parent.id }}).votes()
  }
}

export { Post as default }
