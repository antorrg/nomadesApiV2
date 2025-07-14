import { productService } from './product.routes.js'
// import GeneralRepository from '../../Shared/Repositories/GeneralRepositoy.js'
// import ProductService from './ProducService.js'
// import { Product, Item } from '../../Configs/database.js'
// import { MockDeleteImagesTrue } from '../../../test/helperTest/generalFunctions.js'
// import { productCleaner } from './helpers.js'
// import BaseService from '../../Shared/Services/BaseService.js'
// import { HelperProduct } from './HelperProduct.js'

let itemService
const product = productService

// beforeAll(() => {
//   const productRepo = new GeneralRepository(Product)
//   const itemRepo = new GeneralRepository(Item)
//   itemService = new BaseService(itemRepo, 'Item', 'text', HelperProduct.itemCleaner, true, MockDeleteImagesTrue, 'img')
//   product = new ProductService(
//     productRepo, // Repository
//     'Product', // fieldName
//     'title', // uniqueField
//     productCleaner, // parserFunction
//     true, // useImage
//     MockDeleteImagesTrue, // deleteImages
//     'landing', // nameImage
//     itemService, // secondServe
//     'Item', // secondFieldName
//     'text', // secondUniqueField
//     'img' // secondNameImage
//   )
// })

describe('ProductService Unit Tests', () => {
  let createdProductId

  const mockData = {
    title: 'Test Product',
    info_header: 'Header info',
    info_body: 'Body info',
    landing: 'test-image.jpg',
    items: [
      { text: 'Item 1', img: 'item1.jpg' },
      { text: 'Item 2', img: 'item2.jpg' }
    ]
  }

  test('Should create product with items', async () => {
    const response = await product.create(mockData)

    expect(response.success).toBe(true)
    expect(response.data.product).toHaveProperty('id')
    expect(response.data.product.title).toBe(mockData.title)
    expect(response.data.items.length).toBe(2)

    createdProductId = response.data.product.id
  })

  test('Should get product with items by ID', async () => {
    const response = await product.getById(createdProductId)
    expect(response.success).toBe(true)
    expect(response.data.product.id).toBe(createdProductId)
    expect(response.data.items.length).toBe(2)
  })

  test('Should delete product and related items', async () => {
    try {
      const response = await product.delete(createdProductId)
      expect(response.success).toBe(true)
      expect(response.message).toBe('Product deleted successfully')
      expect(response.data).toBe('Test Product')
    } catch (err) { console.log(err) }

    // Confirm that product no longer exists
    await expect(product.getById(createdProductId)).rejects.toThrow()
  })
})
