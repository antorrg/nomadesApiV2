// import {describe, it, expect, beforeAll} from 'vitest'
import session from 'supertest'
import app from '../server/app.js'
import usersMock from './helperTest/loginToken.help.js'
import * as store from './helperTest/testStore.js'
const agent = session(app)

describe('Integration Landing test', () => {
  beforeAll(async () => {
    await usersMock()
  })
  describe('Route "/api/v2/land/public". Public route', () => {
    it('should retrieve a array of one landing page by default if do not exist elements', async () => {
      const test = await agent
        .get('/api/v1/land/public')
        .expect(200)
      expect(test.body).toEqual([{
        id: false,
        title: 'Pagina web con ejemplos ',
        info_header: 'Nomades web site.',
        image: expect.any(String),
        description: 'Esta es una descripcion del producto mostrado hecha para exhibir el contenido de la pagina',
        enable: true
      }])
    })
  })
  describe('Route "/api/v2/land/". Private route', () => {
    it('should retrieve a array of landing pages with a validate user', async () => {
      const test = await agent
        .get('/api/v1/land')
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .expect(200)
      expect(test.body).toEqual([{
        id: false,
        title: 'Pagina web con ejemplos ',
        info_header: 'Nomades web site.',
        image: expect.any(String),
        description: 'Esta es una descripcion del producto mostrado hecha para exhibir el contenido de la pagina',
        enable: true
      }])
    })
  })
  describe('Route "/api/v2/land/create". Private route', () => {
    it('should create a landing page.', async () => {
      const data = {
        title: 'Pagina web con ejemplos ',
        info_header: 'Nomades web site.',
        image: 'http://localhost:4000/test/helperTest/uploads/amarillo1.jpg',
        description: 'Esta es una descripcion del producto mostrado hecha para exhibir el contenido de la pagina'
      }
      const test = await agent
        .post('/api/v1/land/create')
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .send(data)
        .expect(201)
      store.setId(test.body.id)
      expect(test.body).toEqual({
        id: expect.any(Number),
        title: 'Pagina web con ejemplos ',
        info_header: 'Nomades web site.',
        image: 'http://localhost:4000/test/helperTest/uploads/amarillo1.jpg',
        description: 'Esta es una descripcion del producto mostrado hecha para exhibir el contenido de la pagina',
        enable: true
      })
    })
    it('should throw an error by try create the same landing twice.', async () => {
      const data = {
        title: 'Pagina web con ejemplos ',
        info_header: 'Nomades web site.',
        image: 'http://localhost:4000/test/helperTest/uploads/amarillo1.jpg',
        description: 'Esta es una descripcion del producto mostrado hecha para exhibir el contenido de la pagina'
      }
      const test = await agent
        .post('/api/v1/land/create')
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .send(data)
        .expect(400)
      expect(test.body).toBe('This landing title already exists')
    })
  })
  describe('Route "/api/v2/land/:id". Private route', () => {
    it('should update an element', async () => {
      const data = {
        title: 'Pagina web con ejemplos ',
        info_header: 'Nomades web site.',
        image: 'http://localhost:4000/test/helperTest/uploads/amarillo9.jpg', // campo nuevo
        description: 'Esta es una descripcion del producto mostrado hecha para exhibir el contenido de la pagina',
        enable: true,
        saver: false,
        useImg: false
      }
      const test = await agent
        .put(`/api/v1/land/${store.getId()}`)
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .send(data)
        .expect(200)
      expect(test.body.message).toBe('Landing updated successfully')
      expect(test.body.results).toEqual({
        id: expect.any(Number),
        title: 'Pagina web con ejemplos ',
        info_header: 'Nomades web site.',
        image: 'http://localhost:4000/test/helperTest/uploads/amarillo9.jpg',
        description: 'Esta es una descripcion del producto mostrado hecha para exhibir el contenido de la pagina',
        enable: true
      })
    })
  })
  describe('Route "/api/v2/land". Private route', () => {
    it('should retrieve a array of elements', async () => {
      const test = await agent
        .get('/api/v1/land')
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .expect(200)
      expect(test.body).toEqual([{
        id: expect.any(Number),
        title: 'Pagina web con ejemplos ',
        info_header: 'Nomades web site.',
        image: 'http://localhost:4000/test/helperTest/uploads/amarillo9.jpg',
        description: 'Esta es una descripcion del producto mostrado hecha para exhibir el contenido de la pagina',
        enable: true
      }])
    })
  })
})
