import express from 'express'
import { Landing } from '../../Configs/database.js'
import GeneralRepository from '../../Shared/Repositories/GeneralRepositoy.js'
import BaseService from '../../Shared/Services/BaseService.js'
import BaseController from '../../Shared/Controllers/BaseController.js'
import LandingHelper from './LandingHelper.js'
import ImgsService from '../../Shared/Services/ImgsService.js'
import { Validator } from 'req-valid-express'
import { Auth } from '../../Shared/Auth/Auth.js'
import mailRouter from '../mails/mail.routes.js'
import * as schemas from './landingschemas.mjs'
// import MockImgsService from '../../../test/helperTest/mockImages.js'

const landRepo = new GeneralRepository(Landing, LandingHelper.dataEmptyLanding)

//const MockImgsService = await 

const landServ = new BaseService(
  landRepo,
  'Landing',
  'title',
  LandingHelper.landingParser,
  true,
  ImgsService,
  'image'
)

const land = new BaseController(landServ)

const landRouter = express.Router()

landRouter.use('/public/emails', mailRouter)
landRouter.get('/public', land.getAll)
landRouter.get('/', Auth.verifyToken, land.getAdminAll)

landRouter.get(
  '/:id', 
  Auth.verifyToken, 
  Validator.paramId('id', Validator.ValidReg.INT),
  land.getAdminById)

landRouter.post(
  '/create',
  Auth.verifyToken,
  Validator.validateBody(schemas.landCreate),
  land.create
)

landRouter.put(
  '/:id',
  Auth.verifyToken,
  Validator.paramId('id', Validator.ValidReg.INT),
  Validator.validateBody(schemas.landUpdate),
  land.update
)

export default landRouter
