import session from 'supertest'
import app from '../server/app.js'

import usersMock from './helperTest/loginToken.help.js'
import * as store from './helperTest/testStore.js'
const agent = session(app)

describe('Integration test User', () => {
  beforeAll(async () => {
    await usersMock()
  })
  let ownerToken = ''
  const getOwnerToken = () => { return ownerToken }
  let ownerId = ''
  const getOwnerId = () => { return ownerId }
  describe('Route "/api/v2/user/create". (POST)', () => {
    it('should create an user', async () => {
      const data = { email: 'pericodelospalotes@gmail.com' }
      const test = await agent
        .post('/api/v2/user/create')
        .set('Authorization', `Bearer ${store.getAdminToken()}`)
        .send(data)
        .expect(201)
      expect(test.body).toEqual({
        id: expect.any(String),
        email: 'pericodelospalotes@gmail.com',
        role: 'Usuario',
        nickname: 'pericodelospalotes',
        given_name: null,
        picture: expect.any(String),
        country: null,
        enable: true
      })
    })
    it('should reject if user is not "Admin"', async () => {
      const data = { email: 'pericodelospalotes@gmail.com' }
      const test = await agent
        .post('/api/v2/user/create')
        .set('Authorization', `Bearer ${store.getUserToken()}`)
        .send(data)
        .expect(403)
      expect(test.body).toBe('Access forbidden!')
    })
  })
  describe('Route "/api/v2/user/login". (POST)', () => {
    it('should successfully return a user and authentication token', async () => {
      const data = { email: 'pericodelospalotes@gmail.com', password: 'D12345678' }
      const test = await agent
        .post('/api/v2/user/login')
        .send(data)
        .expect(200)
      ownerToken = test.body.token // Para usar después.
      ownerId = test.body.user.id
      const tokenParts = test.body.token.split('.')
      expect(tokenParts).toHaveLength(3)
      expect(test.body.user).toEqual({
        id: expect.any(String),
        email: 'pericodelospalotes@gmail.com',
        role: 'Usuario',
        nickname: 'pericodelospalotes',
        given_name: null,
        picture: expect.any(String),
        country: null,
        enable: true
      })
    })
  })
  describe('Route "/api/v2/user (GET)', () => {
    it('should retrieve an array of users', async () => {
      const test = await agent
        .get('/api/v2/user')
        .set('Authorization', `Bearer ${store.getAdminToken()}`)
        .expect(200)
      expect(test.body.length).toBe(3)
    })
  })
  describe('Route "/api/v2/user/:id (GET)', () => {
    it('should retrieve one user by Id', async () => {
      const test = await agent
        .get(`/api/v2/user/${getOwnerId()}`)
        .set('Authorization', `Bearer ${store.getAdminToken()}`)
        .expect(200)
      expect(test.body).toEqual({
        id: expect.any(String),
        email: 'pericodelospalotes@gmail.com',
        role: 'Usuario',
        nickname: 'pericodelospalotes',
        given_name: null,
        picture: expect.any(String),
        country: null,
        enable: true
      })
    })
  })
  describe('Route "/api/v2/user/update". (POST)', () => {
    it('should check if the password is correct', async () => {
      const data = { id: getOwnerId(), password: 'D12345678' }
      const test = await agent
        .post('/api/v2/user/update')
        .set('Authorization', `Bearer ${getOwnerToken()}`)
        .send(data)
        .expect(200)
      expect(test.body).toBe('Validacion exitosa')
    })
  })
  describe('Route "/api/v2/user/update/:id". (PATCH)', () => {
    it('should updated the password', async () => {
      const data = { password: 'E987654321' }
      const test = await agent
        .patch(`/api/v2/user/update/${getOwnerId()}`)
        .set('Authorization', `Bearer ${getOwnerToken()}`)
        .send(data)
        .expect(200)
      expect(test.body.message).toBe('User updated successfully')
    })
  })
  describe('Route "/api/v2/user/reset/:id". (PATCH)', () => {
    it('should reset the password', async () => {
      const test = await agent
        .patch(`/api/v2/user/reset/${getOwnerId()}`)
        .set('Authorization', `Bearer ${store.getAdminToken()}`)
        .send({})
        .expect(200)
      expect(test.body.message).toBe('User updated successfully')
    })
  })
  describe('Route "/api/v2/user/profile/:id". (PATCH)', () => {
    it('should update the user profile', async () => {
      const data = { email: 'pericodelospalotes@gmail.com', country: 'argentina', given_name: 'Pedro Del Madero', picture: 'image.com' }
      const test = await agent
        .patch(`/api/v2/user/profile/${getOwnerId()}`)
        .set('Authorization', `Bearer ${getOwnerToken()}`)
        .send(data)
        .expect(200)

      expect(test.body.message).toBe('User updated successfully')
      expect(test.body.results).toEqual({
        id: expect.any(String),
        email: 'pericodelospalotes@gmail.com',
        role: 'Usuario',
        nickname: 'pericodelospalotes',
        given_name: 'Pedro Del Madero',
        picture: 'image.com',
        country: 'argentina',
        enable: true
      })
    })
  })
  describe('Route "/api/v2/user/upgrade/:id". (PATCH)', () => {
    it('should change the role and banner the user', async () => {
      console.log('id', getOwnerId())
      const data = { enable: false, role: 'Moderador' }
      const test = await agent
        .patch(`/api/v2/user/upgrade/${getOwnerId()}`)
        .set('Authorization', `Bearer ${store.getAdminToken()}`)
        .send(data)
        .expect(200)
      expect(test.body.message).toBe('User updated successfully')
      expect(test.body.results).toEqual({
        id: expect.any(String),
        email: 'pericodelospalotes@gmail.com',
        nickname: 'pericodelospalotes',
        given_name: 'Pedro Del Madero',
        picture: 'image.com',
        role: 'Moderador',
        country: 'argentina',
        enable: false
      })
    })
  })
  describe('Route "/api/v2/user/:id". (DELETE)', () => {
    it('should deleted an user', async () => {
      console.log('id', getOwnerId())
      const test = await agent
        .delete(`/api/v2/user/${getOwnerId()}`)
        .set('Authorization', `Bearer ${getOwnerToken()}`)
        .expect(200)
      console.log(test.body)
      expect(test.body).toBe('User deleted successfully')
    })
  })
})
