import pkg from 'jsonwebtoken'
import crypto from 'crypto'
import eh from '../../Configs/errorHandlers.js'
import envConfig from '../../Configs/envConfig.js'

export class Auth {
  static generateToken = (user, expiresIn) => {
    const intData = this.#disguiseRole(user.role, 5)
    const jwtExpiresIn = expiresIn ?? Math.ceil(envConfig.ExpiresIn * 60 * 60)
    const secret = envConfig.Secret
    return pkg.sign(
      { userId: user.id, email: user.email, internalData: intData },
      secret,
      { expiresIn: jwtExpiresIn }
    )
  }

  static generateEmailVerificationToken (user, expiresIn) {
    const userId = user.id
    const secret = envConfig.Secret
    const jwtExpiresIn = expiresIn ?? '8h'
    return pkg.sign(
      { userId, type: 'emailVerification' },
      secret,
      { expiresIn: jwtExpiresIn }
    )
  }

  static verifyToken = async (req, res, next) => {
    try {
      let token = req.headers['x-access-token'] || req.headers.authorization
      if (!token) {
        return next(eh.middError('Unauthorized access. Token not provided', 401))
      }
      if (token.startsWith('Bearer')) {
        token = token.slice(6).trim()
      }
      if (token === '' || token === 'null' || token === 'undefined') {
        return next(eh.middError('Missing token!', 401))
      }

      const decoded = pkg.verify(token, envConfig.Secret)

      // req.user = decoded
      const userId = decoded.userId
      const userRole = this.#recoveryRole(decoded.internalData, 5)
      req.userInfo = { userId, userRole }

      next()
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(eh.middError('Expired token', 401))
      }
      return next(eh.middError('Invalid token', 401))
    }
  }

  static async verifyEmailToken (req, res, next) {
    let token = req.query.token
    token = token.trim()
    if (token === '' || token === 'null' || token === 'undefined') {
      return next(eh.middError('Verification token missing!', 400))
    }
    try {
      const decoded = pkg.verify(token, envConfig.Secret)
      if (decoded.type !== 'emailVerification') {
        return next(eh.middError('Invalid token type', 400))
      }
      // Adjunta el userId al request para el siguiente handler/service
      req.userInfo = { userId: decoded.userId }
      next()
    } catch (error) {
      return next(eh.middError('Invalid or expired token', 400))
    }
  }

  static checkRole (allowedRoles) {
    return (req, res, next) => {
      const { userRole } = req.userInfo || {}
      if (typeof userRole === 'number' && allowedRoles.includes(userRole)) {
        next()
      } else {
        return next(eh.middError('Access forbidden!', 403))
      }
    }
  }

  static #disguiseRole (role, position) {
    const generateSecret = () => crypto.randomBytes(10).toString('hex')
    const str = generateSecret()
    if (position < 0 || position >= str.length) throw new Error('Posición fuera de los límites de la cadena')
    const replacementStr = role.toString()
    return str.slice(0, position) + replacementStr + str.slice(position + 1)
  }

  static #recoveryRole (str, position) {
    if (position < 0 || position >= str.length) throw new Error('Posición fuera de los límites de la cadena')
    const recover = str.charAt(position)
    return parseInt(recover)
  }
}

// En recoveryRole str es el dato entrante (string)
// Este es un modelo de como recibe el parámetro checkRole:
// todo   app.get('/ruta-protegida', checkRole([3]),
