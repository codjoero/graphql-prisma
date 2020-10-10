import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
const APP_SECRET = 'qu1b(9^z$pm%c(n+v243$om0=u2)fw6mp7%evofsdfl2diu5^0u4bxr'

function getUserId(request, requireAuth = true) {
  const Authorization = request.get('authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, APP_SECRET)
    return userId
  }

  if (requireAuth) throw new Error('Authentication required')

  return null
}

function generateToken(userId) {
  return jwt.sign({ userId }, APP_SECRET, {expiresIn: '1 day'})
}

function hashPassword(password) {
  if (password.length < 8) {
    throw new Error('Password must be 8 characters or longer.')
  }

  return bcrypt.hash(password, 10)
}

export { APP_SECRET, getUserId, generateToken, hashPassword}
