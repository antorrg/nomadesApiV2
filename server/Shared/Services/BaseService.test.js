import BaseRepository from '../Repositories/BaseRepository.js'
import BaseService from './BaseService.js'
import { Landing } from '../../Configs/database.js'
import * as info from '../Repositories/helpers/baseRep.test.js'
import { MockDeleteImagesFalse, MockDeleteImagesTrue } from '../../../test/helperTest/generalFunctions.js'

class TestClass extends BaseRepository {
  constructor (Model) {
    super(Model)
  }
}
const testing = new TestClass(Landing)

// repository, fieldName(string), uniqueField(string), cache(boolean), parserFunction(function), useImage(boolean), deleteImages(function)
const serv = new BaseService(
  testing,
  'Landing',
  'title',
  null,
  true,
  MockDeleteImagesFalse,
  'image'
)
const servCache = new BaseService(
  testing,
  'Landing',
  'title',
  info.cleanData,
  false,
  MockDeleteImagesTrue,
  'image'
)
const servParse = new BaseService(
  testing,
  'Landing',
  'title',
  info.cleanData,
  true,
  MockDeleteImagesTrue,
  'image'
)

describe('Test unitarios de la clase BaseService: CRUD.', () => {
  describe('El metodo "create" para crear un servicio', () => {
    it('deberia crear un elemento con los parametros correctos', async () => {
      const element = info.createData // data, uniqueField=null, parserFunction=null, isAdmin = false
      const response = await servParse.create(element)
      expect(response.success).toBe(true)
      expect(response.message).toBe('Landing create successfully')
      expect(response.data).toMatchObject(info.responseData)
    })
    it('deberia arrojar un error al intentar crear dos veces el mismo elemento (manejo de errores)', async () => {
      const element = { title: 'Titulo de la landing' }
      try {
        await servParse.create(element)
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe('This landing title already exists')
        expect(error.status).toBe(400)
      }
    })
  })
  describe('Metodos "GET". Retornar servicios o un servicio.', () => {
    it('Metodo "getAll": deberia retornar un arreglo con los servicios', async () => {
      const element = info.createSecondData
      await serv.create(element)
      const response = await servParse.getAll()
      expect(response.success).toBe(true)
      expect(response.message).toBe('Data found successfully')
      expect(response.data).toEqual([
        {
          id: 1,
          title: 'Titulo de la landing',
          image: 'https://metalogo.com.ar',
          description: 'descripcion',
          enable: true
        },
        {
          id: 2,
          title: 'Titulo de la landing2',
          image: 'https://metalogo.com.ar',
          description: 'descripcion',
          enable: true
        }
      ])
    })
    it('Metodo "getAll": deberia retornar un arreglo con servicios filtrados', async () => {
      const filters = { title: 'Titulo de la landing' }
      const response = await servParse.getAll({ filters })
      expect(response.success).toBe(true)
      expect(response.message).toBe('Data found successfully')
      expect(response.data).toEqual([
        {
          id: 1,
          title: 'Titulo de la landing',
          image: 'https://metalogo.com.ar',
          description: 'descripcion',
          enable: true
        }
      ])
    })
  })
  describe('Metodo "update". Eliminacion de imagenes viejas del storage.', () => {
    it('deberia actualizar los elementos y no eliminar imagenes', async () => {
      const id = 1
      const newData = info.responseData
      const response = await servParse.update(id, newData)
      expect(response.message).toBe('Landing updated successfully')
      expect(response.data).toMatchObject(info.responseData)
    })
    it('deberia actualizar los elementos y gestionar eliminacion de imagenes', async () => {
      const id = 1
      const newData = { image: 'https://imagen.com.ar', useImg: true, saver: true }
      const response = await servParse.update(id, newData)
      expect(response.success).toBe(true)
      expect(response.message).toBe('Landing updated successfully')
      expect(response.data).toMatchObject(info.responseDataImg)
    })
    it('deberia arrojar un error si falla la eliminacion de imagenes', async () => {
      const id = 1
      const newData = info.responseData
      try {
        await serv.update(id, newData)
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.status).toBe(500)
        expect(error.message).toBe(
          'Error deleting from db ImageUrl: https://metalogo.com.ar'
        )
      }
    })
  })
  describe('Metodo "delete".', () => {
    it('deberia borrar un elemento', async () => {
      const id = 1
      const response = await servParse.delete(id)
      expect(response.message).toBe('Landing deleted successfully')
    })
    it('deberia arrojar un error si falla la eliminacion de imagenes', async () => {
      const id = 2
      try {
        await serv.delete(id)
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.status).toBe(500)
        expect(error.message).toBe(
          'Error deleting ImageUrl: https://metalogo.com.ar'
        )
      }
    })
  })
})
