import GeneralRepository from '../../Shared/Repositories/GeneralRepositoy.js'
import ItemService from './ItemService.js'
import { Product, Item } from '../../Configs/database.js'
import ImageHandler from '../../Configs/ImageHandler.js'
import HelperItem from './HelperItem.js'
import * as mock from './mock.help.js'

const itemRep = new GeneralRepository(Item)
const test = new ItemService(itemRep, 'Item', 'img', HelperItem.itemCleaner, true, ImageHandler, 'img')

describe('Class Item. Method GET.', () => {
  beforeAll(async () => {
    try {
      // Limpiar y sembrar productos
      await Product.destroy({ where: {}, restartIdentity: true })
      await Item.destroy({ where: {}, restartIdentity: true })
      await Product.bulkCreate(mock.productSeed)
      await Item.bulkCreate(mock.itemSeed, { validate: true })
    } catch (error) {
      console.error(error)
    }
  })
  describe('getAll method', () => {
    it('should retrieve an array of filtered elements with the text field truncate in 12 words', async () => {
      const isAdmin = false; const filters = { ProductId: 1 }
      const result = await test.getAll({ isAdmin, filters })
      expect(result.message).toBe('Data found successfully')
      expect(result.data.length).toBe(5)
      expect(result.data[0].text).toBe('ab bc cd de ef fg gh hi ij jk kl, lm,...')
    })
  })
  describe('getById method', () => {
    it('should retrieve an element with the text field without truncated words', async () => {
      const result = await test.getById(5)
      console.log('soy items: ', result)
      expect(result.message).toBe('Item found successfully')
      expect(result.data.text.split(' ').length).toBe(14)
      expect(result.data).toEqual({
        id: expect.any(Number),
        img: 'imagen.com',
        text: 'ab bc cd de ef fg gh hi ij jk kl, lm, mn, no',
        ProductId: 2,
        enable: true
      })
    })
  })
})
