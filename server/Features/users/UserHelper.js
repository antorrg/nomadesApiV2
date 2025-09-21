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
      given_name: data.given_name || null,
      picture: data.picture,
      role: roleParsed,
      country: data.country || null,
      enable: data.enable
    }
  }

  static emptyUser () {
    return {
      id: false,
      email: 'No hay datos aun',
      nickname: 'No hay datos aun',
      given_name: 'No hay datos aun',
      picture: env.UserImg,
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
    try{
    const { id } = req.body
    const { userId } = req.userInfo
    if (!id || !userId) { return next(middError('Faltan parametros', 400)) }
    if (id !== userId) { return next(middError('Solo el propietario puede ejecutar esta acción', 400)) }
    next()
    }catch(error){
      return next(middeError('Unexpected error', 500))
    }
  }

  static verifyOwnerActionsParams (req, res, next) {
    try {
      const { id } = req.params
      const { userId } = req.userInfo
      if (!id || !userId) { return next(middError('Faltan parametros', 400)) }
      if (id !== userId) { return next(middError('Solo el propietario puede ejecutar esta acción', 400)) }
      next()
    } catch (error) {
      return next(middError('Error pasando informacion.', 500))
    }
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
    try {
      const role = req.body.role
      const enable = req.body.enable
      // Intentar convertir el role
      const newRole = UserHelper.#revertScope(role)
      if (newRole === 9) return next(middError('No se puede realizar esta accion', 403))
      if (newRole === undefined || newRole === null) {
        return next(middError('El rol no es válido', 400))
      }
      req.body.enable = UserHelper.#optionBoolean(enable)
      req.body.role = newRole
      next()
    } catch (error) {
      return next(middError('Error al pasar informacion', 500))
    }
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
   static protectUpdateProtocol (data, newData) {
    if(data.role === 9){
      console.log('data: ', data.email, ' ', newData.email)
      if( 
      (newData.email && data.email !== newData.email) || // solo si viene email
      (typeof newData.password === 'string' && newData.password) || // solo si viene password
      (newData.role !== undefined && newData.role !== 9) || // solo si viene role
      (newData.enable !== undefined && newData.enable !== true) // solo si viene enable
    )
      return true
    }
  }
  static protectUpdateProtocol2(data, newData) {
  if (data.role !== 9) return false; // solo aplica a role 9

  const rules = {
    email: (oldVal, newVal) => oldVal !== newVal, // no puede cambiar
    password: (_, newVal) => !!newVal,            // no debe estar definido
    role: (_, newVal) => newVal !== undefined && newVal !== 9,
    enable: (_, newVal) => newVal !== undefined && newVal !== true,
  };

  for (const [field, check] of Object.entries(rules)) {
    if (check(data[field], newData[field])) {
      return true; // si alguna regla se dispara, se protege
    }
  }

  return false;
}

  static #scope (role) {
    switch (role) {
      case 2 :
        return 'Moderador'
      case 3 :
        return 'Administrador'
      case 9 :
        return 'S.Admin'
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
        return 3
      case 'S.Admin':
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
