import eh from '../../Configs/errorHandlers.js'
const throwError = eh.throwError

export default class BaseService {
  constructor (
    Repository, // Nombre de la instancia de repository
    fieldName, // Nombre de la tabla de db
    uniqueField, // Nombre de busqueda (create)
    parserFunction = null, // Clase de parseo (static class)
    useImage = false, //  Determina que el servicio utiliza imagenes
    deleteImages = null, // Clase de manejo de imagenes (static Class)
    nameImage = 'picture' // Nombre de la imagen en la tabla de db
  ) {
    this.Repository = Repository
    this.fieldName = fieldName
    this.uniqueField = uniqueField
    this.useImage = useImage
    this.deleteImages = deleteImages
    this.parserFunction = parserFunction
    this.nameImage = nameImage
  }

  async handleImageDeletion (imageUrl, useImg = false) {
    if (this.useImage && imageUrl && useImg) {
      await this.deleteImages.deleteImageFromDb(imageUrl)
    }
  }

  async handleImageProcess (oldImgUrl, saver = false) {
    if (!this.useImage || !this.deleteImages || !this.deleteImages.oldImagesHandler) return
    if (this.useImage && oldImgUrl && saver) {
      await this.deleteImages.oldImagesHandler(oldImgUrl, true)
    }
    await this.deleteImages.oldImagesHandler(oldImgUrl, false)
  }

  async create (data) {
    const imageUrl = data[this.nameImage]
    try {
      const newRecord = await this.Repository.create(data, this.uniqueField)
      await this.handleImageDeletion(imageUrl)

      return {
        success: true,
        message: `${this.fieldName} create successfully`,
        data: newRecord
      }
    } catch (error) {
      throw error
    }
  }

  async getAll ({ isAdmin = false }) {
    const response = await this.Repository.getAll({ isAdmin })
    return {
      success: true,
      message: 'Data found successfully',
      data: this.parserFunction ? response.map(dt => this.parserFunction(dt)) : response
    }
  }
  // searchField = '', search = null, filters = {}, sortBy = 'id', order = 'desc', page = 1, limit = 10

  async getWithPagination (queryObject, isAdmin = false) {
    const response = await this.Repository.getWithPagination(queryObject)

    return {
      info: response.info,
      data: this.parserFunction ? response.data.map(dt => this.parserFunction(dt)) : response.data
    }
  }

  async getById (id, isAdmin = false) {
    const data = await this.Repository.getById(id, isAdmin)

    return {
      success: true,
      message: `${this.fieldName} found successfully`,
      data: this.parserFunction ? this.parserFunction(data) : data
    }
  }

  async getOne ({ data, isAdmin = false }) {
    const existingRecord = await this.Repository.getOne(data, this.uniqueField, isAdmin)
    return existingRecord
  }

  async update (id, newData) {
    const imageUrl = ''
    const oldImgUrl = ''

    const dataFound = await this.Repository.getById(id, newData)

    const isImageChanged = this.useImage &&
  dataFound[this.nameImage] &&
  dataFound[this.nameImage] !== newData[this.nameImage]

    if (isImageChanged) {
      await this.handleImageDeletion(newData[this.nameImage], true)
      await this.handleImageProcess(dataFound[this.nameImage], false)
    }

    const upData = await this.Repository.update(id, newData)

    if (isImageChanged) {
      await this.handleImageDeletion(imageUrl)
      await this.handleImageProcess(oldImgUrl)
    }
    return {
      success: true,
      message: `${this.fieldName} updated successfully`,
      data: upData
    }
  }

  async delete (id) {
    let oldImgUrl = ''
    try {
      const dataFound = await this.Repository.getById(id)
      const dataReg = dataFound[this.fieldName]
      this.useImage ? (oldImgUrl = dataFound[this.nameImage]) : ''

      await this.Repository.delete(id)

      await this.handleImageProcess(oldImgUrl, false)

      return {
        success: true,
        message: `${this.fieldName} deleted successfully`,
        data: dataReg
      }
    } catch (error) {
      throw error
    }
  }
}
