import session from 'supertest'
import app from '../server/app.js'
import usersMock from './helperTest/loginToken.help.js'
import prepareTestImages from './helperTest/prepareTestImages.js'
import * as store from './helperTest/testStore.js'
const agent = session(app)

describe('Integration Work test', () => {
   let imagesCopied = []
  beforeAll(async () => {
    await usersMock()
     imagesCopied = await prepareTestImages(2)
  })
  describe('Route "/api/v2/work/public".', () => {
    it('should retrieve a array of one element by default if do not exist elements', async () => {
      const test = await agent
        .get('/api/v2/work/public')
        .expect(200)
      expect(test.body).toEqual([{
        id: false,
        title: 'aun no hay datos',
        image: 'aun no hay datos',
        text: 'aun no hay datos',
        enable: true
      }])
    })
  })
  describe('Route "/api/v2/work/:id". Private route', () => {
    it('should retrieve a array of working pages with a validate user', async () => {
      const test = await agent
        .get('/api/v2/work')
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .expect(200)
      expect(test.body).toEqual([{
        id: false,
        title: 'aun no hay datos',
        image: 'aun no hay datos',
        text: 'aun no hay datos',
        enable: true
      }])
    })
  })
  describe('Route "/api/v2/work/create". Private route', () => {
    it('should create a working page.', async () => {
      const data = {
        title: 'aun no hay datos',
        image: imagesCopied[0],
        text: 'aun no hay datos',
        enable: true,
        useImg: false
      }
      const test = await agent
        .post('/api/v2/work/create')
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .send(data)
        .expect(201)
      store.setId(test.body.id)
      expect(test.body).toEqual({
        id: expect.any(Number),
        title: 'aun no hay datos',
        image: imagesCopied[0],
        text: 'aun no hay datos',
        enable: true
      })
    })
    it('should throw an error by try create the same working twice.', async () => {
      const data = {
        title: 'aun no hay datos',
        image: imagesCopied[0],
        text: 'aun no hay datos',
        enable: true,
        useImg: false
      }
      const test = await agent
        .post('/api/v2/work/create')
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .send(data)
        .expect(400)
      expect(test.body).toBe('This work title already exists')
    })
  })
  describe('Route "/api/v2/work/:id". Private route', () => {
    it('should retrieve an element with a validate user', async () => {
      const test = await agent
        .get(`/api/v2/work/${store.getId()}`)
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .expect(200)
      expect(test.body).toEqual({
        id: expect.any(Number),
        title: 'aun no hay datos',
        image: imagesCopied[0],
        text: 'aun no hay datos',
        enable: true
      })
    })
  })
  describe('Route "/api/v2/work/:id". Private route', () => {
    it('should update an element', async () => {
      const data = {
        title: 'aun no hay datos',
        text: 'aun no hay datos',
        image: imagesCopied[1], // campo nuevo
        enable: true,
        saver: false,
        useImg: false
      }
      const test = await agent
        .put(`/api/v2/work/${store.getId()}`)
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .send(data)
        .expect(200)
      expect(test.body.message).toBe('Work updated successfully')
      expect(test.body.results).toEqual({
        id: expect.any(Number),
        title: 'aun no hay datos',
        image: imagesCopied[1],
        text: 'aun no hay datos',
        enable: true
      })
    })
  })
  describe('Route "/api/v2/work/:id". Private route', () => {
    it('should delete an element', async () => {
      const test = await agent
        .delete(`/api/v2/work/${store.getId()}`)
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .expect(200)
      expect(test.body).toBe('Work deleted successfully')
    })
  })
})
