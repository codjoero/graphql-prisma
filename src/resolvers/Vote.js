const Vote = {
  post(parent, args, { prisma }, info) {
    return prisma.vote.findOne({ where: { id: parent.id }}).post()
  },
  user(parent, args, { prisma }, info) {
    return prisma.vote.findOne({ where: { id: parent.id }}).user()
  }
}

export { Vote as default}
