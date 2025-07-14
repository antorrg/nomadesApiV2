import session from 'supertest'
import app from '../server/app.js'
import usersMock from './helperTest/loginToken.help.js'
import * as store from './helperTest/testStore.js'
const agent = session(app)

describe('Integration Product/Item test', () => {
  beforeAll(async () => {
    await usersMock()
  })
  describe('Route "/api/v2/product/public".', () => {
    it('should retrieve a array of one element by default if do not exist elements', async () => {
      const test = await agent
        .get('/api/v1/product/public')
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
    it('should retrieve a array of product pages with a validate user', async () => {
      const test = await agent
        .get('/api/v1/product')
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
    it('should create a product page.', async () => {
      const data = {
        title: 'No hay datos aun',
        landing: 'http://localhost:4000/test/helperTest/uploads/amarillo1.jpg',
        info_header: 'No hay datos aun',
        info_body: 'No hay datos aun',
        items: [{ text: 'text1', img: 'http://localhost:4000/test/helperTest/uploads/amarillo1.jpg' },
          { text: 'text2', img: 'http://localhost:4000/test/helperTest/uploads/amarillo1.jpg' }]
      }
      const test = await agent
        .post('/api/v1/product/create')
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .send(data)
        .expect(201)
      store.setId(test.body.product.id)
      expect(test.body.items.length).toBe(2)
      expect(test.body.product).toEqual({
        id: expect.any(Number),
        title: 'No hay datos aun',
        landing: 'http://localhost:4000/test/helperTest/uploads/amarillo1.jpg',
        info_header: 'No hay datos aun',
        info_body: 'No hay datos aun',
        enable: true
      })
    })
    it('should throw an error by try create the same producting twice.', async () => {
      const data = {
        title: 'No hay datos aun',
        landing: 'http://localhost:4000/test/helperTest/uploads/amarillo1.jpg',
        info_header: 'No hay datos aun',
        info_body: 'No hay datos aun',
        url: 'No hay datos aun',
        enable: true,
        items: [{ text: 'text1', img: 'http://localhost:4000/test/helperTest/uploads/amarillo1.jpg' },
          { text: 'text2', img: 'http://localhost:4000/test/helperTest/uploads/amarillo1.jpg' }]
      }
      const test = await agent
        .post('/api/v1/product/create')
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .send(data)
        .expect(400)
      expect(test.body).toBe('This product title already exists')
    })
  })
  describe('Route "/api/v2/product/:id". Private route', () => {
    it('should retrieve an element with a validate user', async () => {
      const test = await agent
        .get(`/api/v1/product/${store.getId()}`)
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .expect(200)
      expect(test.body).toEqual({
        product: {id: expect.any(Number),
        title: 'No hay datos aun',
        landing: 'http://localhost:4000/test/helperTest/uploads/amarillo1.jpg',
        info_header: 'No hay datos aun',
        info_body: 'No hay datos aun',
        enable: true},
        items: [
            {id:expect.any(Number),text: 'text1', img:'http://localhost:4000/test/helperTest/uploads/amarillo1.jpg', enable:true, ProductId: expect.any(Number)},
            {id: expect.any(Number), text: 'text2', img:'http://localhost:4000/test/helperTest/uploads/amarillo1.jpg',enable:true, ProductId: expect.any(Number)}
        ]
      })
    })
  })
  describe('Route "/api/v2/product/:id". Private route', () => {
    it('should update an element', async () => {
      const data = {
        title: 'No hay datos aun',
        landing: 'http://localhost:4000/test/helperTest/uploads/amarillo9.jpg',
        info_header: 'No hay datos aun',
        info_body: 'No hay datos aun',
        enable: false
      }
      const test = await agent
        .put(`/api/v1/product/${store.getId()}`)
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .send(data)
        .expect(200)
      expect(test.body.message).toBe('Product updated successfully')
      expect(test.body.results).toEqual({
        id: expect.any(Number),
        title: 'No hay datos aun',
        landing: 'http://localhost:4000/test/helperTest/uploads/amarillo9.jpg',
        info_header: 'No hay datos aun',
        info_body: 'No hay datos aun',
        enable: false
      })
    })
  })
  describe('Route "/api/v2/product/item/public/:id', () => {
    it('should retrieve a item by id', async() => { 
          const test = await agent
        .get(`/api/v1/product/item/public/1`)
        .expect(200)
      expect(test.body).toEqual({
        id:1,
        text: 'text1', 
        img:'http://localhost:4000/test/helperTest/uploads/amarillo1.jpg', 
        enable:true, 
        ProductId:1
      })
    })
  })
  describe('Route "/api/v2/product/item/:id". Private route', () => {
    it('should retrieve a item by id', async() => { 
        const test = await agent
        .get(`/api/v1/product/item/1`)
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .expect(200)
      expect(test.body).toEqual({
        id:1,
        text: 'text1', 
        img:'http://localhost:4000/test/helperTest/uploads/amarillo1.jpg', 
        enable:true, 
        ProductId:1
      })
    })
  })
  describe('Route "/api/v2/product/item/create". Private route', () => {
    it('should create an item', async() => { 
        const data = {
        text: 'text3', 
        img:'http://localhost:4000/test/helperTest/uploads/amarillo1.jpg', 
        enable:true, 
        ProductId:1
      }
        const test = await agent
        .post(`/api/v1/product/item/create`)
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .send(data)
        .expect(201)
      expect(test.body).toEqual({
        id:3,
        text: 'text3', 
        img:'http://localhost:4000/test/helperTest/uploads/amarillo1.jpg', 
        enable:true, 
        ProductId:1
      })
    })
  })
   describe('Route "/api/v2/product/item/:id". Private route', () => {
    it('should update an item', async() => { 
        const data = {
        text: 'texto general', 
        img:'http://localhost:4000/test/helperTest/uploads/amarillo9.jpg', 
        enable:true, 
        ProductId:1
      }
        const test = await agent
        .put(`/api/v1/product/item/3`)
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .send(data)
        .expect(200)
      expect(test.body.message).toBe('Item updated successfully')
      expect(test.body.results).toEqual({
        id:3,
        text: 'texto general', 
        img:'http://localhost:4000/test/helperTest/uploads/amarillo9.jpg', 
        enable:true, 
        ProductId:1
      })
    })
  })
   describe('Route "/api/v2/product/:id". Private route', () => {
    it('should delete an item', async () => {
      const test = await agent
        .delete(`/api/v1/product/item/3`)
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .expect(200)
      expect(test.body).toBe('Item deleted successfully')
    })
  })
  describe('Route "/api/v2/product/:id". Private route', () => {
    it('should delete an element', async () => {
      const test = await agent
        .delete(`/api/v1/product/${store.getId()}`)
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .expect(200)
      expect(test.body).toBe('Product deleted successfully')
    })
  })
})
