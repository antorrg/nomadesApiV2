import express from 'express'
import { User } from '../../Configs/database.js'
import GeneralRepository from '../../Shared/Repositories/GeneralRepositoy.js'
import UserService from './UserService.js'
import UserController from './UserController.js'
import MiddlewareHandler from '../../Shared/Middlewares/MiddlewareHandler.js'
import UserHelper from './UserHelper.js'
import ImageHandler from '../../Configs/ImageHandler.js'
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

userRouter.get('/', user.getAll)

userRouter.get('/:id', MiddlewareHandler.middUuid('id'), user.getById)

userRouter.post(
  '/create',
  Auth.verifyToken,
  Auth.checkRole([0, 9]),
  MiddlewareHandler.validateFields(util.userCreate),
  MiddlewareHandler.validateRegex(
    util.email,
    'email',
    'Introduzca un mail valido'
  ),
  UserHelper.createUserDefault,
  user.create
)

userRouter.post(
  '/login',
  MiddlewareHandler.validateFields(util.userLogin),
  MiddlewareHandler.validateRegex(
    util.email,
    'email',
    'Introduzca un mail valido'
  ),
  MiddlewareHandler.validateRegex(
    util.password,
    'password',
    'La contraseña debe incluir por lo menos 8 caracteres 1 mayuscula'
  ),
  user.login
)

userRouter.post(
  '/update',
  Auth.verifyToken,
  UserHelper.verifyOwnerActions,
  MiddlewareHandler.validateFields(util.verifyPassword),
  MiddlewareHandler.validateRegex(util.uuidv4, 'id', 'Id inválido'),
  MiddlewareHandler.validateRegex(
    util.password,
    'password',
    'La contraseña debe incluir por lo menos 8 caracteres 1 mayuscula'
  ),
  user.verifyPass
)

userRouter.get('/protect', Auth.verifyToken, user.getAdminAll)

userRouter.get(
  '/protect/:id',
  Auth.verifyToken,
  MiddlewareHandler.middUuid('id'),
  user.getAdminById
)

userRouter.put(
  // editar perfil
  '/profile/:id',
  Auth.verifyToken,
  MiddlewareHandler.middUuid('id'),
  MiddlewareHandler.validateFields(util.userUpd),
  UserHelper.verifyOwnerActions,
  UserHelper.profileParserInfo,
  user.update
)

userRouter.put(
  // reset password
  '/reset/:id',
  Auth.verifyToken,
  MiddlewareHandler.middUuid('id'),
  Auth.checkRole([0, 9]),
  UserHelper.resetPassParser,
  user.update
)

userRouter.put(
  // cambiar password
  '/update/:id',
  Auth.verifyToken,
  Auth.checkRole([0, 9]),
  MiddlewareHandler.middUuid('id'),
  MiddlewareHandler.validateFields(util.changePassword),
  MiddlewareHandler.validateRegex(
    util.password,
    'password',
    'La contraseña debe incluir por lo menos 8 caracteres 1 mayuscula'
  ),
  UserHelper.verifyOwnerActionsParams,
  UserHelper.hasheredPass,
  user.update
)

userRouter.put(
  // cambiar permisos, bloqueo
  '/upgrade/:id',
  Auth.verifyToken,
  Auth.checkRole([0, 9]),
  MiddlewareHandler.middUuid('id'),
  MiddlewareHandler.validateFields(util.userUpgrade),
  UserHelper.upgradeUserParser,
  user.update
)

userRouter.delete('/:id', MiddlewareHandler.middUuid('id'), user.delete)

export default userRouter
