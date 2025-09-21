import session from 'supertest'
import serverTest from './testHelpers/serverTest.help.js'
const agent = session(serverTest)

describe('Clase "MiddlewareHandler". Validacion y tipado de datos', () => {
  describe('Metodo "validateFields". Validacion y tipado datos en body (POST y PUT)', () => {
    it('deberia validar, tipar los parametros y permitir el paso si estos fueran correctos.', async () => {
      const data = {
        name: 'name',
        amount: '100',
        price: '55.44',
        enable: 'true',
        arreglo: []
      }
      const response = await agent
        .post('/test/body/create')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Passed middleware')
      expect(response.body.data).toEqual({
        name: 'name',
        amount: 100,
        price: 55.44,
        enable: true,
        arreglo: []
      })
    })
    it('deberia validar, tipar y arrojar un error si faltara algun parametro.', async () => {
      const data = { name: 'name', amount: '100', price: '55.44', arreglo: [] }
      const response = await agent
        .post('/test/body/create')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toBe('Missing parameters: enable')
    })
    it('deberia validar, tipar y arrojar un error si no fuera posible tipar un parametro.', async () => {
      const data = {
        name: 'name',
        amount: 'ppp',
        price: '55.44',
        enable: 'true',
        arreglo: []
      }
      const response = await agent
        .post('/test/body/create')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toBe('Invalid integer value')
    })
    it('deberia validar, tipar los parametros y permitir el paso quitando todo parametro no declarado.', async () => {
      const data = {
        name: 'name',
        email: 'pepe@gmail.com',
        amount: '100',
        price: '55.44',
        enable: 'true',
        arreglo: []
      }
      const response = await agent
        .post('/test/body/create')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Passed middleware')
      expect(response.body.data).toEqual({
        name: 'name',
        amount: 100,
        price: 55.44,
        enable: true,
        arreglo: []
      })
    })
  })
  describe('Metodo "validateFieldsWithItems". Validacion y tipado datos en body (POST y PUT). Objeto anidado.', () => {
    it('deberia validar, tipar los parametros y permitir el paso si estos fueran correctos.', async () => {
      const data = {
        name: 'name',
        amount: '100',
        price: '55.44',
        enable: 'true',
        arreglo: [],
        items: [{ name: 'name', picture: 'string', enable: 'true', arreglo: [] }]
      }
      const response = await agent
        .post('/test/body/extra/create')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Passed middleware')
      expect(response.body.data).toEqual({
        name: 'name',
        amount: 100,
        price: 55.44,
        enable: true,
        arreglo: [],
        items: [{ name: 'name', picture: 'string', enable: true, arreglo: [] }]
      })
    })
    it('deberia validar, tipar y arrojar un error si faltara algun parametro.', async () => {
      const data = {
        name: 'name',
        amount: '100',
        price: '55.44',
        enable: 'true',
        arreglo: [],
        items: [{ name: 'name', enable: 'true', arreglo: [] }]
      }
      const response = await agent
        .post('/test/body/extra/create')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toBe('Missing parameters in items[0]: picture')
    })
    it('deberia validar, tipar y arrojar un error si no fuera posible tipar un parametro.', async () => {
      const data = {
        name: 'name',
        amount: '100',
        price: '55.44',
        enable: 'true',
        arreglo: [],
        items: [{ name: 'name', picture: 'string', enable: '445', arreglo: [] }]
      }
      const response = await agent
        .post('/test/body/extra/create')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toBe('Invalid boolean value')
    })
    it('deberia validar, tipar los parametros y permitir el paso quitando todo parametro no declarado.', async () => {
      const data = {
        name: 'name',
        amount: '100',
        price: '55.44',
        enable: 'true',
        arreglo: [],
        items: [
          {
            name: 'name',
            picture: 'string',
            enable: 'true',
            deletedAt: 'queseyo',
            arreglo: []
          }
        ]
      }
      const response = await agent
        .post('/test/body/extra/create')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Passed middleware')
      expect(response.body.data).toEqual({
        name: 'name',
        amount: 100,
        price: 55.44,
        enable: true,
        arreglo: [],
        items: [{ name: 'name', picture: 'string', enable: true, arreglo: [] }]
      })
    })
  })
  describe('Metodo "validateQuery", validacion y tipado de queries en peticiones GET', () => {
    it('deberia validar, tipar los parametros y permitir el paso si estos fueran correctos.', async () => {
      const response = await agent
        .get('/test/param?page=2&size=2.5&fields=pepe&truthy=true')
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Passed middleware')
      expect(response.body.validData).toEqual({
        page: 2,
        size: 2.5,
        fields: 'pepe',
        truthy: true
      })
    })
    it('deberia llenar la query con valores por defecto si esta llegare vacía.', async () => {
      const response = await agent
        .get('/test/param')
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Passed middleware')
      expect(response.body.validData).toEqual({
        page: 1,
        size: 1,
        fields: '',
        truthy: false
      })
    })
    it('deberia arrojar un error si algun parametro incorrecto no se pudiere convertir.', async () => {
      const response = await agent
        .get('/test/param?page=pepe&size=2.5')
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toBe('Invalid integer value')
    })
    it('deberia eliminar los valores que excedan a los declarados.', async () => {
      const response = await agent
        .get('/test/param?page=2&size=2.5&fields=pepe&truthy=true&demas=pepito')
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Passed middleware')
      expect(response.body.validData).toEqual({
        page: 2,
        size: 2.5,
        fields: 'pepe',
        truthy: true
      })
    })
  })
  describe('Metodo "validateRegex", validacion de campo especifico a traves de un regex.', () => {
    it('deberia permitir el paso si el parametro es correcto.', async () => {
      const data = { email: 'emaildeprueba@ejemplo.com' }
      const response = await agent
        .post('/test/user')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Passed middleware')
      expect(response.body.data).toEqual({
        email: 'emaildeprueba@ejemplo.com'
      })
    })
    it('deberia arrojar un error si el parametro no es correcto.', async () => {
      const data = { email: 'emaildeprueba@ejemplocom' }
      const response = await agent
        .post('/test/user')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toBe(
        'Invalid email format! Introduzca un mail valido'
      )
    })
  })
  describe('Metodo "middUuid", validacion de id en "param". Tipo de dato UUID v4', () => {
    it('deberia permitir el paso si el Id es uuid válido.', async () => {
      const id = 'c1d970cf-9bb6-4848-aa76-191f905a2edd'
      const response = await agent
        .get(`/test/param/${id}`)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Passed middleware')
    })
    it('deberia arrojar un error si el Id no es uuid válido.', async () => {
      const id = 'c1d970cf-9bb6-4848-aa76191f905a2edd1'
      const response = await agent
        .get(`/test/param/${id}`)
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toBe('Parametros no permitidos')
    })
  })

  describe('Metodo "middIntId", validacion de id en "param". Tipo de dato INTEGER.', () => {
    it('deberia permitir el paso si el Id es numero entero válido', async () => {
      const id = 1
      const response = await agent
        .get(`/test/param/int/${id}`)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Passed middleware')
    })
    it('deberia arrojar un error si el Id no es numero entero válido.', async () => {
      const id = 'dkdi'
      const response = await agent
        .get(`/test/param/int/${id}`)
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toBe('Parametros no permitidos')
    })
  })
})
