import express from 'express'
import { Work } from '../../Configs/database.js'
import GeneralRepository from '../../Shared/Repositories/GeneralRepositoy.js'
import BaseService from '../../Shared/Services/BaseService.js'
import BaseController from '../../Shared/Controllers/BaseController.js'
import ImageHandler from '../../Configs/ImageHandler.js'
import { WorkHelp } from './WorkHelp.js'
import MiddlewareHandler from '../../Shared/Middlewares/MiddlewareHandler.js'
import { Auth } from '../../Shared/Auth/Auth.js'

const workCreate = [{ name: 'title', tipe: 'string' }, { name: 'image', type: 'string' }, { name: 'text', type: 'string' }, { name: 'useImg', type: 'boolean' }]
const workUpdate = [{ name: 'title', tipe: 'string' }, { name: 'image', type: 'string' }, { name: 'text', type: 'string' }, { name: 'enable', type: 'boolean' }, { name: 'saver', type: 'boolean' }, { name: 'useImg', type: 'boolean' }]

const workRepo = new GeneralRepository(Work, WorkHelp.dataEmptyWork)
const workServ = new BaseService(
  workRepo,
  'Work',
  'title',
  WorkHelp.cleaner,
  true,
  ImageHandler,
  'image'
)
const work = new BaseController(workServ)

const workRouter = express.Router()

workRouter.get('/public', work.getAll)
workRouter.get(
  '/public/:id',
  MiddlewareHandler.middIntId('id'),
  work.getById
)
workRouter.get('/', Auth.verifyToken, work.getAdminAll)

workRouter.get(
  '/:id',
  MiddlewareHandler.middIntId('id'),
  work.getAdminById
)

workRouter.post(
  '/create',
  Auth.verifyToken,
  MiddlewareHandler.validateFields(workCreate),
  work.create
)

workRouter.put(
  '/:id',
  Auth.verifyToken,
  MiddlewareHandler.middIntId('id'),
  MiddlewareHandler.validateFields(workUpdate),
  work.update
)

workRouter.delete(
  '/:id',
  Auth.verifyToken,
  MiddlewareHandler.middIntId('id'),
  work.delete
)

export default workRouter
