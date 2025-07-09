import BaseService from '../../Shared/Services/BaseService.js'

export default class ItemService extends BaseService {
  constructor (Repository, fieldName, uniqueField, parserFunction = null, useImage = false, deleteImages = null, nameImage = 'picture') {
    super(Repository, fieldName, uniqueField, parserFunction, useImage, deleteImages, nameImage)
  }

  async getAll ({ isAdmin = false, filters = {} }) {
    const response = await this.Repository.getAll({ isAdmin, filters })
    return {
      success: true,
      message: 'Data found successfully',
      data: this.parserFunction ? response.map(dt => this.parserFunction(dt, false)) : response
    }
  }

  async getById (id, isAdmin = false) {
    const data = await this.Repository.getById(id, isAdmin)

    return {
      success: true,
      message: `${this.fieldName} found successfully`,
      data: this.parserFunction ? this.parserFunction(data, true) : data
    }
  }
}
