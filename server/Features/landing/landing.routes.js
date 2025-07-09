import express from 'express'
import { Landing } from '../../Configs/database.js'
import GeneralRepository from '../../Shared/Repositories/GeneralRepositoy.js'
import BaseService from '../../Shared/Services/BaseService.js'
import BaseController from '../../Shared/Controllers/BaseController.js'
import LandingHelper from './LandingHelper.js'
import ImageHandler from '../../Configs/ImageHandler.js'
import MiddlewareHandler from '../../Shared/Middlewares/MiddlewareHandler.js'
import { Auth } from '../../Shared/Auth/Auth.js'

const landCreate = [
  { name: 'title', type: 'string' },
  { name: 'image', type: 'string' },
  { name: 'info_header', type: 'string' },
  { name: 'description', type: 'string' },
  { name: 'useImg', type: 'boolean' }
]
const landUpdate = [
  { name: 'title', type: 'string' },
  { name: 'image', type: 'string' },
  { name: 'info_header', type: 'string' },
  { name: 'description', type: 'string' },
  { name: 'saver', type: 'boolean' },
  { name: 'useImg', type: 'boolean' }
]

const landRepo = new GeneralRepository(Landing)
const landServ = new BaseService(
  landRepo,
  'Landing',
  'title',
  LandingHelper.landingParser,
  true,
  ImageHandler,
  'image'
)
const land = new BaseController(landServ)
const landRouter = express.Router()

landRouter.get('/', land.getAll)
landRouter.get('/admin', Auth.verifyToken, land.getAdminAll)

landRouter.post(
  '/create',
  Auth.verifyToken,
  MiddlewareHandler.validateFields(landCreate),
  land.create
)

landRouter.put(
  '/:id',
  Auth.verifyToken,
  MiddlewareHandler.validateFields(landUpdate),
  land.update
)

export default landRouter
