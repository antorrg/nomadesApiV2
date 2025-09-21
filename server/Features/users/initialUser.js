import { User } from '../../Configs/database.js'
import env from '../../Configs/envConfig.js'
import bcrypt from 'bcrypt'

const initialUser = async () => {
  const hasheredPass = await bcrypt.hash(env.RootPass, 12)
  const data = {
    email: env.RootEmail,
    nickname: env.RootEmail.split('@')[0],
    password: hasheredPass,
    role: 9,
    picture: env.UserImg
  }
  try {
    const users = await User.findAll()
    if (users.length > 0) {
      return console.log('The user already exists!')
    }
    const superUser = await User.create(data)
    if (!superUser) {
      const error = error
      error.status = 500
      throw error
    }
    return console.log('The user was successfully created!!')
  } catch (error) {
    console.error('Algo ocurrió al inicio: ', error)
  }
}
export default initialUser
