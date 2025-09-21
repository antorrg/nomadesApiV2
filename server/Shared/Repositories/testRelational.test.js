import BaseRepository from './BaseRepository.js'
import eh from '../../Configs/errorHandlers.js'

jest.mock('../../Configs/errorHandlers.js', () => ({
  throwError: jest.fn((msg, code) => {
    const err = new Error(msg)
    err.statusCode = code
    throw err
  })
}))

// Clase hija para poder instanciar BaseRepository
class MockRepo extends BaseRepository {
  constructor () {
    super({}, null)
  }
}

describe('BaseRepository addRelation', () => {
  let repo, mockInstance

  beforeEach(() => {
    mockInstance = {
      addTestRelation: jest.fn(),
      setTestRelation: jest.fn()
    }

    repo = new MockRepo()
    repo.Model = {
      name: 'MockRepo',
      findByPk: jest.fn()
    }
  })

  test('Agrega relación múltiple con add', async () => {
    repo.Model.findByPk.mockResolvedValue(mockInstance)

    await repo.addRelation(1, 'TestRelation', [5, 6])

    expect(mockInstance.addTestRelation).toHaveBeenCalledWith([5, 6])
  })

  test('Asocia relación uno a uno con set', async () => {
    repo.Model.findByPk.mockResolvedValue(mockInstance)

    await repo.addRelation(1, 'TestRelation', 7)

    expect(mockInstance.setTestRelation).toHaveBeenCalledWith(7)
  })

  test('Lanza error si la relación no existe', async () => {
    repo.Model.findByPk.mockResolvedValue({})

    await expect(repo.addRelation(1, 'Invalid', 7)).rejects.toThrow('Relation \'Invalid\' does not exist')
  })

  test('Lanza error si el registro no existe', async () => {
    repo.Model.findByPk.mockResolvedValue(null)

    await expect(repo.addRelation(1, 'TestRelation', 7)).rejects.toThrow('MockRepo not found')
  })
})
