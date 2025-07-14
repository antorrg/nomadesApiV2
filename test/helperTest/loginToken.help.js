/* istanbul ignore file */
import { User } from '../../server/Configs/database.js'
import { Auth } from '../../server/Shared/Auth/Auth.js'
import * as store from './testStore.js'

export const admin = { email: 'josenomeacuerdo@hotmail.com', password: 'L1234567', nickname: 'josenomeacuerdo', role: 9, picture: 'url' }

const user = { email: 'juangarcia@gmail.com', password: 'L1234567', nickname: 'juangarcia', role: 1, picture: 'url' }

const usersMock = async () => {
  try {
    const users = await User.findAll()
    if (users.length > 0) {
      return console.log('The user already exists!')
    }
    await Promise.all([userMock(admin, store.setAdminToken, store.setAdminId), userMock(user, store.setUserToken, store.setId)])
  } catch (error) {
    console.error('Algo ocurrió al inicio: ', error)
  }
}

async function userMock (data, storedToken, storedId) {
  try {
    const userCreated = await User.create(data)
    if (!userCreated) {
      const error = error
      error.status = 500
      throw error
    }
    storedToken(Auth.generateToken(userCreated))
    storedId(userCreated.id)
    return console.log('Created: ', userCreated.nickname + ' ', userCreated.role)
  } catch (error) {
    console.error('Algo ocurrió al inicio: ', error)
  }
}

export default usersMock
