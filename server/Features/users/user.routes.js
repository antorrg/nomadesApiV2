import express from 'express'
import { User } from '../../Configs/database.js'
import GeneralRepository from '../../Shared/Repositories/GeneralRepositoy.js'
import UserService from './UserService.js'
import UserController from './UserController.js'
import { Validator } from 'req-valid-express'
import UserHelper from './UserHelper.js'
import * as schema from './userSchemas/index.js'
import * as util from './userUtilities.js'
import { Auth } from '../../Shared/Auth/Auth.js'

const userRepo = new GeneralRepository(User, UserHelper.emptyUser)
export const userServ = new UserService(
  userRepo,
  'User',
  'email',
  UserHelper.userParser,
  false,
  null,
  'picture'
)
const user = new UserController(userServ)

const userRouter = express.Router()

userRouter.get(
  '/',
  Auth.verifyToken,
  user.getAdminAll
)

userRouter.get(
  '/:id',
  Auth.verifyToken,
  Validator.paramId('id', Validator.ValidReg.UUIDv4),
  user.getAdminById
)

userRouter.post(
  '/create',
  Auth.verifyToken,
  Auth.checkRole([0, 9]),
  Validator.validateBody(schema.userCreate),
  Validator.validateRegex(
    util.emailRegex,
    'email',
    'Introduzca un mail valido'
  ),
  UserHelper.createUserDefault,
  user.create
)

userRouter.post(
  '/login',
  Validator.validateBody(schema.userLogin),
  Validator.validateRegex(
    util.emailRegex,
    'email',
    'Introduzca un mail valido'
  ),
  Validator.validateRegex(
    util.passwordRegex,
    'password',
    'La contraseña debe incluir por lo menos 8 caracteres 1 mayuscula'
  ),
  user.login
)

userRouter.post(
  '/update',
  Auth.verifyToken,
  UserHelper.verifyOwnerActions,
  Validator.validateBody(schema.verifypassword),
  Validator.validateRegex(util.uuidv4Regex, 'id', 'Id inválido'),
  Validator.validateRegex(
    util.passwordRegex,
    'password',
    'La contraseña debe incluir por lo menos 8 caracteres 1 mayuscula'
  ),
  user.verifyPass
)

userRouter.patch(
  // editar perfil
  '/profile/:id',
  Auth.verifyToken,
  Validator.paramId('id', Validator.ValidReg.UUIDv4),
  Validator.validateBody(schema.userUpd),
  UserHelper.verifyOwnerActionsParams,
  UserHelper.profileParserInfo,
  user.update
)

userRouter.patch(
  // reset password
  '/reset/:id',
  Auth.verifyToken,
  Validator.paramId('id', Validator.ValidReg.UUIDv4),
  Auth.checkRole([0, 9]),
  UserHelper.resetPassParser,
  user.update
)

userRouter.patch(
  // cambiar password
  '/update/:id',
  Auth.verifyToken,
  Validator.paramId('id', Validator.ValidReg.UUIDv4),
  Validator.validateBody(schema.changePassword),
  Validator.validateRegex(
    util.passwordRegex,
    'password',
    'La contraseña debe incluir por lo menos 8 caracteres 1 mayuscula'
  ),
  UserHelper.verifyOwnerActionsParams,
  UserHelper.hasheredPass,
  user.update
)

userRouter.patch(
  // cambiar permisos, bloqueo
  '/upgrade/:id',
  Auth.verifyToken,
  Auth.checkRole([3, 9]),
  Validator.paramId('id', Validator.ValidReg.UUIDv4),
  Validator.validateBody(schema.userupgrade),
  UserHelper.upgradeUserParser,
  user.update
)

userRouter.delete(
  '/:id',
  Auth.verifyToken,
  Validator.paramId('id', Validator.ValidReg.UUIDv4),
  user.delete
)

export default userRouter
