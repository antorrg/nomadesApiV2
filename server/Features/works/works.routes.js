import express from 'express'
import { Work } from '../../Configs/database.js'
import GeneralRepository from '../../Shared/Repositories/GeneralRepositoy.js'
import BaseService from '../../Shared/Services/BaseService.js'
import BaseController from '../../Shared/Controllers/BaseController.js'
import ImgsService from '../../Shared/Services/ImgsService.js'
import { WorkHelp } from './WorkHelp.js'
import { Validator } from 'req-valid-express'
import { Auth } from '../../Shared/Auth/Auth.js'
import * as schemas from './workschemas.mjs'


const workRepo = new GeneralRepository(Work, WorkHelp.dataEmptyWork)
const workServ = new BaseService(
  workRepo,
  'Work',
  'title',
  WorkHelp.cleaner,
  true,
  ImgsService,
  'image'
)
const work = new BaseController(workServ)

const workRouter = express.Router()

workRouter.get('/public', work.getAll)
workRouter.get(
  '/public/:id',
   Validator.paramId('id', Validator.ValidReg.INT),
  work.getById
)
workRouter.get(
  '/', 
  Auth.verifyToken, 
  work.getAdminAll)

workRouter.get(
  '/:id',
   Auth.verifyToken, 
   Validator.paramId('id', Validator.ValidReg.INT),
  work.getAdminById
)

workRouter.post(
  '/create',
  Auth.verifyToken,
  Validator.validateBody(schemas.create),
  work.create
)

workRouter.put(
  '/:id',
  Auth.verifyToken,
  Validator.paramId('id', Validator.ValidReg.INT),
   Validator.validateBody(schemas.update),
  work.update
)

workRouter.delete(
  '/:id',
  Auth.verifyToken,
  Validator.paramId('id', Validator.ValidReg.INT),
  work.delete
)

export default workRouter
