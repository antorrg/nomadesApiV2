// import { describe, it, expect, vi, beforeEach } from 'vitest'
import MockImgsService from '../../test/helperTest/mockImages.js'
import fs from 'fs/promises'
import { Image } from './database.js'
import { throwError } from './errorHandlers.js'
import createMockFile from '../../test/helperTest/createMockFile.js'
import { setId, getId } from '../../test/helperTest/testStore.js'

describe('MockImgsService', () => {
  describe('uploadNewImage', () => {
    it('debe crear la carpeta, guardar el archivo y devolver la url', async () => {
      const file = createMockFile('test.jpg')
      const url = await MockImgsService.uploadNewImage(file)
      setId(url)
      expect(url).toBe('http://localhost/fake-test-server/test/helperTest/uploads/test.jpg')
    })

    it('debe lanzar error si falla', async () => {
      fs.mkdir.mockRejectedValue(new Error('fail'))
      await expect(MockImgsService.uploadNewImage('image.png')).rejects.toThrow('fail')
    })
  })

  describe('deleteImageFromDb', () => {
    it('borra imagen si existe', async () => {
      const url = 'http://localhost/fake-test-server/test/helperTest/uploads/test.jpg'
      await expect(MockImgsService.deleteImageFromDb(getId())).resolves.toBe('Imagen borrada exitosamente')
    })

    it('lanza error si no encuentra imagen', async () => {
      Image.findOne.mockResolvedValue(null)
      await expect(MockImgsService.deleteImageFromDb('noexiste')).rejects.toThrow('Imagen no hallada')
    })

    it('maneja errores inesperados', async () => {
      Image.findOne.mockRejectedValue(new Error('db fail'))
      await expect(MockImgsService.deleteImageFromDb('url')).rejects.toThrow('db fail')
    })
  })

  describe('oldImagesHandler', () => {
    it('retorna una Promise (saveImageInDb) si isRedirect es true', () => {
      const result = MockImgsService.oldImagesHandler('url', true)
      expect(result).toBeInstanceOf(Promise)
    })

    it('retorna una Promise (mockfunctiondelete) si isRedirect es false', () => {
      const result = MockImgsService.oldImagesHandler('url', false)
      expect(result).toBeInstanceOf(Promise)
    })
  })

  // Si quieres probar funciones internas como saveImageInDb o mockfunctiondelete, lo ideal es exportarlas para testearlas
})
