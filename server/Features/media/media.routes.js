import express from 'express'
import { Media } from '../../Configs/database.js'
import GeneralRepository from '../../Shared/Repositories/GeneralRepositoy.js'
import BaseService from '../../Shared/Services/BaseService.js'
import BaseController from '../../Shared/Controllers/BaseController.js'
import * as imgController from '../image/imgController.js'
import { Auth } from '../../Shared/Auth/Auth.js'
import * as schemas from './mediaSchema.mjs'
import { Validator } from 'req-valid-express'
import { emptyObject } from './mediaHelper.js'

const mediaRepo = new GeneralRepository(Media, emptyObject)
const mediaService = new BaseService(
  mediaRepo,
  'media',
  'title',
  null, // parser
  false,
  null,
  'none'
)
const media = new BaseController(mediaService)


const mediaRouter = express.Router()

mediaRouter.get(
  '/imgs',
  imgController.getImagesFromDb
)

mediaRouter.delete(
  '/imgs/:id',
    Validator.paramId('id', Validator.ValidReg.INT),
  imgController.delImagesFromDb
)

mediaRouter.post(
  '/videos/create',
  Auth.verifyToken,
  //Validator.validateBody(schemas.create),
  media.create
)

mediaRouter.get(
  '/videos/public',
  media.getAll
)

mediaRouter.get(
  '/videos/public/:id',
    Validator.paramId('id', Validator.ValidReg.INT),
  media.getById
)

mediaRouter.get(
  '/videos',
  Auth.verifyToken,
  media.getAdminAll
)

mediaRouter.get(
  '/videos/:id',
  Auth.verifyToken,
    Validator.paramId('id', Validator.ValidReg.INT),
  media.getAdminById
)

mediaRouter.put(
  '/videos/update/:id',
  Auth.verifyToken,
    Validator.paramId('id', Validator.ValidReg.INT),
   //Validator.validateBody(schemas.update),
  media.update
)

mediaRouter.delete(
  '/videos/:id',
  Auth.verifyToken,
    Validator.paramId('id', Validator.ValidReg.INT),
  media.delete
)

export default mediaRouter
