import eh from '../../Configs/errorHandlers.js'

const throwError = eh.throwError
// Esto es lo mas parecido a una clase abstracta, no se puede instanciar, solo se puede extender.

export default class BaseRepository {
  constructor (Model, dataEmpty = null) {
    if (new.target === BaseRepository) {
      throw new Error('No se puede instanciar una clase abstracta.')
    }
    this.Model = Model
    this.dataEmpty = dataEmpty
  }

  async create (data, uniqueField) {
    try {
      const whereClause = {}
      if (uniqueField) {
        whereClause[uniqueField] = data[uniqueField]
      }
      const existingRecord = await this.Model.findOne({ where: whereClause })

      if (existingRecord) {
        throwError(
          `This ${this.Model.name.toLowerCase()} ${
            uniqueField || 'entry'
          } already exists`,
          400
        )
      }
      const newRecord = await this.Model.create(data)

      return newRecord
    } catch (error) {
      throw error
    }
  }

  async getAll ({ isAdmin = false, filters = {} } = {}) {
    try {
      const existingRecord = await this.Model.scope(
        isAdmin ? 'allRecords' : 'enabledOnly'
      ).findAll({ where: filters })
      if (!existingRecord) { throwError('Unexpected error', 500) }
      if (existingRecord.length === 0) {
        return [this.dataEmpty] || [{ message: 'No data yet' }]
      }
      return existingRecord
    } catch (error) {
      throw error
    }
  }

  async getWithPagination (
    searchField = '',
    search = null,
    order,
    sortBy,
    page = 1,
    limit = 10,
    isAdmin = false
  ) {
    const offset = (page - 1) * limit

    // Construimos el filtro de búsqueda
    const whereClause = {}
    if (search && searchField) {
      whereClause[searchField] = {
        [Op.iLike]: `%${search}%`
      }
    }

    // Construimos el ordenamiento
    const orderClause = []
    if (sortBy && order) {
      orderClause.push([sortBy, order.toUpperCase()])
    }

    const { rows: resModel, count: totalCount } = await this.Model.scope(
      isAdmin ? 'allRecords' : 'enabledOnly'
    ).findAndCountAll({
      limit,
      offset,
      where: whereClause,
      order: orderClause,
      distinct: true
    })

    if (resModel.length === 0) {
      if (this.dataEmpty) {
        resModel.push(this.dataEmpty)
      } else {
        throwError(
          `This ${this.Model.name.toLowerCase()} ${
            searchField || 'entry'
          } does not exist`,
          404
        )
      }
    }

    return {
      info: {
        total: totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit)
      },
      data: resModel
    }
  }

  async getOne (data, uniqueField, isAdmin = false) {
    try {
      const whereClause = {}
      if (uniqueField) {
        whereClause[uniqueField] = data
      }
      const existingRecord = await this.Model.scope(
        isAdmin ? 'allRecords' : 'enabledOnly'
      ).findOne({ where: whereClause })
      if (!existingRecord) {
        throwError(
          `This ${this.Model.name.toLowerCase()} name do not exists`,
          404
        )
      }
      return existingRecord
    } catch (error) {
      throw error
    }
  }

  async getById (id, isAdmin = false) {
    try {
      const existingRecord = await this.Model.scope(
        isAdmin ? 'allRecords' : 'enabledOnly'
      ).findByPk(id)
      if (!existingRecord) {
        throwError(
          `This ${this.Model.name.toLowerCase()} name do not exists`,
          404
        )
      }
      return existingRecord
    } catch (error) {
      throw error
    }
  }

  async update (id, data) {
    const dataFound = await this.Model.findByPk(id)
    if (!dataFound) {
      throwError(`${this.Model.name} not found`, 404)
    }
    const upData = await dataFound.update(data)
    return upData
  }

  async delete (id) {
    const dataFound = await this.Model.findByPk(id)
    if (!dataFound) {
      throwError(`${this.Model} not found`, 404)
    }
    await dataFound.destroy(id)
    return `${this.Model.name} deleted successfully`
  }

  /**
 * Asocia un registro relacionado usando los métodos de Sequelize (add, set, etc.)
 * @param {number} id - ID del registro principal
 * @param {string} relation - Nombre de la relación (según la asociación definida en el modelo)
 * @param {any} relatedData - Puede ser ID o array de IDs según la relación
 */
  async addRelation (id, relation, relatedData) {
    const dataFound = await this.Model.findByPk(id)
    if (!dataFound) {
      throwError(`${this.Model.name} not found`, 404)
    }

    // Verifica que la relación exista
    if (typeof dataFound[`add${relation}`] !== 'function' && typeof dataFound[`set${relation}`] !== 'function') {
      throwError(`Relation '${relation}' does not exist on ${this.Model.name}`, 400)
    }

    // Usamos add si es una relación múltiple, set si es uno a uno
    if (Array.isArray(relatedData)) {
      if (typeof dataFound[`add${relation}`] === 'function') {
        await dataFound[`add${relation}`](relatedData)
      } else {
        throwError(`add${relation} is not defined on ${this.Model.name}`, 400)
      }
    } else {
      if (typeof dataFound[`set${relation}`] === 'function') {
        await dataFound[`set${relation}`](relatedData)
      } else if (typeof dataFound[`add${relation}`] === 'function') {
        await dataFound[`add${relation}`]([relatedData])
      } else {
        throwError(`set${relation} or add${relation} is not defined on ${this.Model.name}`, 400)
      }
    }

    return `${relation} associated successfully to ${this.Model.name}`
  }
}
