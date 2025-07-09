import BaseService from '../../Shared/Services/BaseService.js'

export default class ProductService extends BaseService {
  constructor (
    Repository,
    fieldName,
    uniqueField,
    parserFunction = null,
    useImage = false,
    deleteImages = null,
    nameImage = 'picture',
    secondServ,
    secondFielName,
    secondUniqueField,
    secondNameImage = 'picture'
  ) {
    super(Repository, fieldName, uniqueField, parserFunction, useImage, deleteImages, nameImage)
    this.secondServ = secondServ
    this.secondFielName = secondFielName
    this.secondUniqueField = secondUniqueField
    this.secondNameImage = secondNameImage
  }

  // Crear producto + sus ítems
  async create (data) {
    const { title, info_header, info_body, landing, items } = data
    const producData = { title, info_header, info_body, landing }
    const imageUrl = data[this.nameImage]

    try {
      const product = await this.Repository.create(producData, this.uniqueField)
      await this.handleImageDeletion(imageUrl)

      const ProductId = product.id
      const createdItems = []

      if (Array.isArray(items)) {
        for (const element of items) {
          const item = await this.secondServ.create({ ...element, ProductId }, this.secondUniqueField)
          createdItems.push(item)
        }
      }

      return {
        success: true,
        message: `${this.fieldName} created successfully`,
        data: { product, items: createdItems }
      }
    } catch (error) {
      throw error
    }
  }

  // Traer producto por id + sus ítems relacionados
  async getById (id, isAdmin = false) {
    const dataFound = await this.Repository.getById(id, isAdmin)
    const ProdId = dataFound.ProductId
    const filter = { ProductId: ProdId }
    const items = await this.secondServ.getAll({ isAdmin, filter })
    const itemsFound = items.data

    return {
      success: true,
      message: `${this.fieldName} found successfully`,
      data: {
        product: this.parserFunction ? this.parserFunction(dataFound) : dataFound,
        items: itemsFound
      }
    }
  }

  // Borrar producto + ítems relacionados + imágenes
  async delete (id) {
    let oldImgUrl = ''
    const itemsImgs = []
    const itemIds = []

    try {
      const dataFound = await this.Repository.getById(id, true)
      if (this.useImage) oldImgUrl = dataFound[this.nameImage]
      // Buscar los ítems relacionados
      const items = await this.secondServ.getAll({ ProductId: id })
      const productItems = items.data

      for (const item of productItems) {
        const url = item[this.secondNameImage]
        const itemId = item.id
        itemsImgs.push(url)
        itemIds.push(itemId)
      }

      // Borrar ítems primero
      const deletePromises = itemIds.map(element =>
        this.secondServ.delete(element)
      )
      await Promise.all(deletePromises)

      // Borrar el producto principal
      await this.Repository.delete(id)

      // Borrar imagen principal si corresponde
      await this.handleImageProcess(oldImgUrl, false)

      return {
        success: true,
        message: `${this.fieldName} deleted successfully`,
        data: dataFound[this.uniqueField]
      }
    } catch (error) {
      throw error
    }
  }
}
