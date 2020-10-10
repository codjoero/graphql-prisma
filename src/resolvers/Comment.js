const Comment = {
  author(parent, args, { prisma }, info) {
    return prisma.comment.findOne({
      where: { id: parent.id }
    }).author()
  },
  post(parent, args, { prisma }, info) {
    return prisma.comment.findOne({
      where: { id: parent.id }
    }).post()
  }
}

export { Comment as default }
