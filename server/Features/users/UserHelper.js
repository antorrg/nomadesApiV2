import env from '../../Configs/envConfig.js'
import eh from '../../Configs/errorHandlers.js'
import bcrypt from 'bcrypt'

const middError = eh.middError

export default class UserHelper {
  static userParser = (data) => {
    const roleParsed = this.#scope(data.role)
    return {
      id: data.id,
      email: data.email,
      nickname: data.nickname,
      name: data.name,
      surname: data.surname,
      picture: data.picture,
      role: roleParsed,
      country: data.country,
      enable: data.enable
    }
  }

  static emptyUser () {
    return {
      id: false,
      email: 'No hay datos aun',
      nickname: 'No hay datos aun',
      given_name: 'No hay datos aun',
      picture: env.userImg,
      role: 'No hay datos aun',
      country: 'No hay datos aun',
      enable: 'No hay datos aun'
    }
  }

  static async createUserDefault (req, res, next) {
    const user = req.body
    if (!user || !user.email) { return next(middError('Email es requerido', 400)) }
    const hashedPass = await bcrypt.hash(env.DefaultPass, 12)
    const nickNamed = user.email.split('@')[0]

    req.body.password = hashedPass
    req.body.nickname = nickNamed
    req.body.role = 1
    req.body.picture = env.UserImg
    next()
  }

  static verifyOwnerActions (req, res, next) {
    const { id } = req.body
    const { userId } = req.userInfo
    if (!id || !userId) { return next(middError('Faltan parametros', 400)) }
    if (id !== userId) { return next(middError('Solo el propietario puede ejecutar esta acción', 400)) }
    next()
  }

  static verifyOwnerActionsParams (req, res, next) {
    const { id } = req.params
    const { userId } = req.userInfo
    if (!id || !userId) { return next(middError('Faltan parametros', 400)) }
    if (id !== userId) { return next(middError('Solo el propietario puede ejecutar esta acción', 400)) }
    next()
  }

  static async hasheredPass (req, res, next) {
    const hashedPass = await bcrypt.hash(req.body.password, 12)
    req.body.password = hashedPass

    next()
  }

  static async resetPassParser (req, res, next) {
    req.body = {}
    const hashedPass = await bcrypt.hash(env.DefaultPass, 12)
    req.body.password = hashedPass
    next()
  }

  static upgradeUserParser (req, res, next) {
    const role = req.body.role
    const enable = req.body.enable
    // Intentar convertir el role
    const newRole = this.#revertScope(role)
    if (newRole === 9) return next(middError('No se puede realizar esta accion', 403))
    // console.log('soy newRole', newRole)
    if (newRole === undefined || newRole === null) {
      return next(middError('El campo role no es válido', 400))
    }
    req.body.enable = this.#optionBoolean(enable)
    req.body.role = newRole
    next()
  }

  static profileParserInfo (req, res, next) {
    const { email } = req.body

    if (!email) { return next(middError('Falta el email!', 400)) }

    req.body.nickname = email.split('@')[0]

    next()
  }

  static protectProtocol (data) {
    return data.role === 9
  }

  static #scope (role) {
    switch (role) {
      case 2 :
        return 'Moderador'
      case 9 :
        return 'Administrador'
      case 1 :
      default :
        return 'Usuario'
    }
  }

  static #revertScope (role) {
    switch (role) {
      case 'Moderador':
        return 2
      case 'Administrador':
        return 9
      case 'Usuario':
      default :
        return 1
    }
  }

  static #optionBoolean (save) {
    if (save === 'true' || save === true) {
      return true
    } else if (save === 'false' || save === false) {
      return false
    } else {
      return false
    }
  }
}
