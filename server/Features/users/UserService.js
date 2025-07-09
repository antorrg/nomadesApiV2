import bcrypt from 'bcrypt'
import BaseService from '../../Shared/Services/BaseService.js'
import { Auth } from '../../Shared/Auth/Auth.js'
import eh, { throwError } from '../../Configs/errorHandlers.js'
import UserHelper from './UserHelper.js'

export default class UserService extends BaseService {
  constructor (
    Repository, // Nombre de la instancia de repository
    fieldName, // Nombre de la tabla de db
    uniqueField, // Nombre de busqueda (create)
    parserFunction = null, // Clase de parseo (static class)
    useImage = false, //  Determina que el servicio utiliza imagenes
    deleteImages = null, // Clase de manejo de imagenes (static Class)
    nameImage = 'picture' // Nombre del campo de la imagen
  ) {
    super(
      Repository,
      fieldName,
      uniqueField,
      parserFunction,
      useImage,
      deleteImages,
      nameImage
    )
  }

  async #validUser (data, isLogin) {
    const user = isLogin
      ? await this.Repository.getOne(data.email, this.uniqueField, true)
      : await this.Repository.getById(data.id, true)

    if (!user || user === undefined) {
      eh.throwError('Este usuario no existe', 404)
    }
    const passwordMatch = await bcrypt.compare(data.password, user.password)
    if (!passwordMatch) {
      eh.throwError('Contraseña no valida', 400)
    }
    if (user.enable === false) {
      eh.throwError('Usuario bloqueado!', 403)
    }
    return user
  }

  async login (data) {
    const isLogin = true
    const user = await this.#validUser(data, isLogin)
    const token = Auth.generateToken(user)
    return {
      success: true,
      message: 'Login exitoso',
      data: { user, token }
    }
  }

  async verifyPass (data) {
    const isLogin = false
    const user = await this.#validUser(data, isLogin)
    return {
      success: true,
      message: 'Validacion exitosa',
      data: null
    }
  }

  async update (id, newData) {
    const dataFound = await this.Repository.getById(id, newData)
    if (!dataFound) throwError('Usuario no encontrado', 404)
    const noDelete = UserHelper.protectProtocol(dataFound)
    if (
      noDelete &&
      (newData.email || newData.password || newData.role || newData.enable)
    ) {
      throwError('Accion no permitida', 403)
    }
    await super.update(id, newData)
  }

  async delete (id) {
    const dataFound = await this.Repository.getById(id)
    if (!dataFound) throwError('Usuario no encontrado', 404)
    const noDelete = UserHelper.protectProtocol(dataFound)
    if (noDelete) throwError('Accion no permitida', 403)
    await super.delete(id)
  }
}
