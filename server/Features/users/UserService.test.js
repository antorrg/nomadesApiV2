import bcrypt from 'bcrypt'
import GeneralRepository from '../../Shared/Repositories/GeneralRepositoy.js'
import UserService from './UserService.js'
import { User } from '../../Configs/database.js'
import { MockDeleteImagesTrue } from '../../../test/helperTest/generalFunctions.js'
import UserHelper from './UserHelper.js'

let userRep
let userServ

beforeAll(async () => {
  userRep = new GeneralRepository(User)
  userServ = new UserService(userRep, 'User', 'email', UserHelper.userParser, false, MockDeleteImagesTrue, 'picture')

  // Insertamos usuarios de prueba en la base de datos
  const passwordHash = await bcrypt.hash('123456', 12)

  await User.bulkCreate([
    { email: 'user@test.com', password: passwordHash, role: 1, enable: true },
    { email: 'moderator@test.com', password: passwordHash, role: 2, enable: true },
    { email: 'admin@test.com', password: passwordHash, role: 3, enable: true },
    { email: 'super@test.com', password: passwordHash, role: 9, enable: true },
    { email: 'blocked@test.com', password: passwordHash, role: 1, enable: false }
  ])
})

describe('UserService - login y verifyPass', () => {
  test('Login exitoso de usuario normal', async () => {
    const response = await userServ.login({ email: 'user@test.com', password: '123456' })

    expect(response.success).toBe(true)
    expect(response.data.user.email).toBe('user@test.com')
    expect(response.data.token).toBeDefined()
  })

  test('Login falla con contraseña incorrecta', async () => {
    await expect(userServ.login({ email: 'user@test.com', password: 'wrongpass' }))
      .rejects
      .toThrow('Contraseña no valida')
  })

  test('Login falla con usuario bloqueado', async () => {
    await expect(userServ.login({ email: 'blocked@test.com', password: '123456' }))
      .rejects
      .toThrow('Usuario bloqueado!')
  })

  test('Login falla con email inexistente', async () => {
    await expect(userServ.login({ email: 'noexiste@test.com', password: '123456' }))
      .rejects
      .toThrow('This user name do not exists')
  })

  test('verifyPass exitoso', async () => {
    // Primero buscamos el ID del usuario
    const user = await User.findOne({ where: { email: 'user@test.com' } })

    const response = await userServ.verifyPass({ id: user.id, password: '123456' })
    expect(response.success).toBe(true)
    expect(response.message).toBe('Validacion exitosa')
  })

  test('verifyPass falla con contraseña incorrecta', async () => {
    const user = await User.findOne({ where: { email: 'user@test.com' } })

    await expect(userServ.verifyPass({ id: user.id, password: 'wrongpass' }))
      .rejects
      .toThrow('Contraseña no valida')
  })

  test('verifyPass falla con usuario inexistente', async () => {
    await expect(userServ.verifyPass({ id: 'd45796ab-12a2-489e-9cc1-541ba7e05471', password: '123456' }))
      .rejects
      .toThrow('This user name do not exists')
  })

  test('verifyPass falla con usuario bloqueado', async () => {
    const blocked = await User.findOne({ where: { email: 'blocked@test.com' } })

    await expect(userServ.verifyPass({ id: blocked.id, password: '123456' }))
      .rejects
      .toThrow('Usuario bloqueado!')
  })
})
describe('UserService - update y delete', () => {
  test('No permite update de superadmin en campos protegidos', async () => {
    const superAdmin = await User.findOne({ where: { email: 'super@test.com' } })

    const newData = { email: 'cambiado@test.com', password: 'nuevaClave123', role: 2 }

    await expect(userServ.update(superAdmin.id, newData))
      .rejects
      .toThrow('Accion no permitida')
  })

  test('Permite update de superadmin en campos no protegidos', async () => {
    const superAdmin = await User.findOne({ where: { email: 'super@test.com' } })

    const newData = { country: 'argentina' } // Campo no protegido

    await userServ.update(superAdmin.id, newData)

    const updated = await User.findByPk(superAdmin.id)
    expect(updated.country).toBe('argentina')
  })

  test('Permite update de usuario normal en cualquier campo', async () => {
    const user = await User.findOne({ where: { email: 'user@test.com' } })

    const newData = { email: 'actualizado@test.com', password: 'nuevaclave456', role: 2 }

    await userServ.update(user.id, newData)

    const updated = await User.findByPk(user.id)
    expect(updated.email).toBe('actualizado@test.com')
    expect(updated.role).toBe(2)
  })

  test('No permite delete de superadmin', async () => {
    const superAdmin = await User.findOne({ where: { email: 'super@test.com' } })

    await expect(userServ.delete(superAdmin.id))
      .rejects
      .toThrow('Accion no permitida')
  })

  test('Permite delete de usuario normal', async () => {
    const user = await User.create({
      email: 'delete@test.com',
      password: await bcrypt.hash('delete123', 10),
      role: 1,
      enable: true
    })

    await userServ.delete(user.id)

    const deleted = await User.findByPk(user.id)
    expect(deleted).toBeNull()
  })
})
