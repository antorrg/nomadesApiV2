import session from 'supertest'
import app from '../server/app.js'
import usersMock from './helperTest/loginToken.help.js'
import * as store from './helperTest/testStore.js'
import { Image } from '../server/Configs/database.js'
import prepareTestImages from './helperTest/prepareTestImages.js'
const agent = session(app)

describe('Integration Product/Item test', () => {
  let copiedFiles = []
  beforeAll(async () => {
    await usersMock()
    copiedFiles = await prepareTestImages()
  })
  describe('Route "/api/v2/product/public".', () => {
    it('should retrieve a array of one element by default if do not exist elements 1', async () => {
      const test = await agent
        .get('/api/v2/product/public')
        .expect(200)
      expect(test.body).toEqual([{
        id: false,
        title: 'No hay datos aun',
        landing: 'No hay datos aun',
        info_header: 'No hay datos aun',
        info_body: 'No hay datos aun',
        enable: false
      }])
    })
  })
  describe('Route "/api/v2/product". Private route', () => {
    it('should retrieve a array of product pages with a validate user 2', async () => {
      const test = await agent
        .get('/api/v2/product')
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .expect(200)
      expect(test.body).toEqual([{
        id: false,
        title: 'No hay datos aun',
        landing: 'No hay datos aun',
        info_header: 'No hay datos aun',
        info_body: 'No hay datos aun',
        enable: false
      }])
    })
  })
  describe('Route "/api/v2/product/create". Private route', () => {
    it('should create a product page 3.', async () => {
      const data = {
        title: 'No hay datos aun',
        landing: copiedFiles[0],
        info_header: 'No hay datos aun',
        info_body: 'No hay datos aun',
        useImg: false,
        items: [{ text: 'text1', img: copiedFiles[1], useImg:false },
          { text: 'text2', img: copiedFiles[2], useImg: false }]
      }
      const test = await agent
        .post('/api/v2/product/create')
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .send(data)
        .expect(201)
        expect(test.body.items.length).toBe(2)
        expect(test.body.product).toEqual({
          id: expect.any(Number),
          title: 'No hay datos aun',
          landing: copiedFiles[0],
          info_header: 'No hay datos aun',
          info_body: 'No hay datos aun',
          enable: true
        })
        store.setId(test.body.product.id)
    })
    it('should throw an error by try create the same producting twice. 4', async () => {
      const data = {
        title: 'No hay datos aun',
        landing: copiedFiles[0],
        info_header: 'No hay datos aun',
        info_body: 'No hay datos aun',
        url: 'No hay datos aun',
        enable: true,
        useImg: false,
        items: [{ text: 'text1', img: copiedFiles[1], useImg: false },
          { text: 'text2', img: copiedFiles[2], useImg: false }]
      }
      const test = await agent
        .post('/api/v2/product/create')
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .send(data)
        .expect(400)
      expect(test.body).toBe('This product title already exists')
    })
  })
  describe('Route "/api/v2/product/:id". Private route', () => {
    it('should retrieve an element for a validate user 5', async () => {
      const test = await agent
        .get(`/api/v2/product/${store.getId()}`)
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .expect(200)
      expect(test.body).toEqual({
        product: {
          id: expect.any(Number),
          title: 'No hay datos aun',
          landing: copiedFiles[0],
          info_header: 'No hay datos aun',
          info_body: 'No hay datos aun',
          enable: true
        },
        items: [
          { id: expect.any(Number), text: 'text1', img: copiedFiles[1], enable: true, ProductId: expect.any(Number) },
          { id: expect.any(Number), text: 'text2', img: copiedFiles[2], enable: true, ProductId: expect.any(Number) }
        ]
      })
    })
  })
  describe('Route "/api/v2/product/:id". Private route', () => {
    it('should update an element 6', async () => {
      const data = {
        title: 'No hay datos aun11',
        landing: copiedFiles[3],
        info_header: 'No hay datos aun',
        info_body: 'No hay datos aun',
        enable: false,
        useImg: false,
        saver:false
      }
      const test = await agent
        .put(`/api/v2/product/${store.getId()}`)
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .send(data)
        .expect(200)
      expect(test.body.message).toBe('Product updated successfully')
      expect(test.body.results).toEqual({
        id: expect.any(Number),
        title: 'No hay datos aun11',
        landing: copiedFiles[3],
        info_header: 'No hay datos aun',
        info_body: 'No hay datos aun',
        enable: false
      })
    })
  })
  describe('Route "/api/v2/product/item/public/:id', () => {
    it('should retrieve a item by id 7', async () => {
      const test = await agent
        .get('/api/v2/product/item/public/1')
        .expect(200)
      expect(test.body).toEqual({
        id: 1,
        text: 'text1',
        img: copiedFiles[1],
        enable: true,
        ProductId: 1
      })
    })
  })
  describe('Route "/api/v2/product/item/:id". Private route', () => {
    it('should retrieve a item by id 8', async () => {
      const test = await agent
        .get('/api/v2/product/item/1')
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .expect(200)
      expect(test.body).toEqual({
        id: 1,
        text: 'text1',
        img: copiedFiles[1],
        enable: true,
        ProductId: 1
      })
    })
  })
  describe('Route "/api/v2/product/item/create". Private route', () => {
    it('should create an item 9', async () => {
      const data = {
        text: 'text3',
        img: copiedFiles[4],
        enable: true,
        ProductId: 1,
        useImg: false
      }
      const test = await agent
        .post('/api/v2/product/item/create')
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .send(data)
        .expect(201)
      expect(test.body).toEqual({
        id: 3,
        text: 'text3',
        img: copiedFiles[4],
        enable: true,
        ProductId: 1
      })
    })
  })
  describe('Route "/api/v2/product/item/:id". Private route', () => {
    it('should update an item 10', async () => {
      const data = {
        text: 'texto general',
        img: copiedFiles[5],
        enable: true,
        ProductId: 1,
        useImg: false,
        saver: false
      }
      const test = await agent
        .put('/api/v2/product/item/3')
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .send(data)
        .expect(200)
      expect(test.body.message).toBe('Item updated successfully')
      expect(test.body.results).toEqual({
        id: 3,
        text: 'texto general',
        img: copiedFiles[5],
        enable: true,
        ProductId: 1
      })
    })
     it('should update an item and save old image (saver:true) 11', async () => {
      const data = {
        text: 'texto general',
        img: copiedFiles[6],
        enable: true,
        ProductId: 1,
        useImg:false,
        saver: true
      }
      const test = await agent
        .put('/api/v2/product/item/3')
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .send(data)
        .expect(200)
      expect(test.body.message).toBe('Item updated successfully')
      expect(test.body.results).toEqual({
        id: 3,
        text: 'texto general',
        img: copiedFiles[6],
        enable: true,
        ProductId: 1
      })
      const verify = await Image.findOne({where: {imageUrl: copiedFiles[5]}})
      expect(verify.imageUrl).toBe(copiedFiles[5])
    })
    it('should update an item and use the old image (useImg: true) 12', async () => {
      const data = {
        text: 'texto general',
        img: copiedFiles[5],
        enable: true,
        ProductId: 1,
        useImg:true,
        saver: false
      }
      const test = await agent
        .put('/api/v2/product/item/3')
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .send(data)
        .expect(200)
      expect(test.body.message).toBe('Item updated successfully')
      expect(test.body.results).toEqual({
        id: 3,
        text: 'texto general',
        img: copiedFiles[5],
        enable: true,
        ProductId: 1
      })
      const verify = await Image.findOne({where: {imageUrl: copiedFiles[5]}})
      expect(verify).toBe(null)
    })
  })
  describe('Route "/api/v2/product/:id". Private route', () => {
    it('should delete an item 13', async () => {
      const test = await agent
        .delete('/api/v2/product/item/2')
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .expect(200)
        console.log(test.body)
      expect(test.body).toBe('Item deleted successfully')
    })
  })
  describe('Route "/api/v2/product/:id". Private route', () => {
    it('should delete an element 14', async () => {
      const test = await agent
        .delete(`/api/v2/product/${store.getId()}`)
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .expect(200)
      expect(test.body).toBe('Product deleted successfully')
    })
  })
})
  
