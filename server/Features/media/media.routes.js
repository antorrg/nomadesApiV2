import express from 'express'
import { Media } from '../../Configs/database.js'
import GeneralRepository from '../../Shared/Repositories/GeneralRepositoy.js'
import BaseService from '../../Shared/Services/BaseService.js'
import BaseController from '../../Shared/Controllers/BaseController.js'
import * as imgController from '../image/imgController.js'
import { Auth } from '../../Shared/Auth/Auth.js'
import MiddlewareHandler from '../../Shared/Middlewares/MiddlewareHandler.js'

const mediaRepo = new GeneralRepository(Media)
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

const mediaCreate = [{ name: 'title', type: 'string' }, { name: 'type', type: 'string' }, { name: 'text', type: 'string' }, { name: 'url', type: 'string' }, { name: 'enable', type: 'boolean' }]
const mediaUpdate = [{ name: 'title', type: 'string' }, { name: 'type', type: 'string' }, { name: 'text', type: 'string' }, { name: 'url', type: 'string' }, { name: 'enable', type: 'boolean' }]

const mediaRouter = express.Router()

mediaRouter.get(
  '/imgs',
  imgController.getImagesFromDb
)

mediaRouter.delete(
  '/imgs/:id',
  MiddlewareHandler.middIntId('id'),
  imgController.delImagesFromDb
)

mediaRouter.post(
  '/videos/create',
  Auth.verifyToken,
  MiddlewareHandler.validateFields(mediaCreate),
  media.create
)

mediaRouter.get(
  '/videos',
  media.getAll
)

mediaRouter.get(
  '/videos/:id',
  MiddlewareHandler.middIntId('id'),
  media.getById
)

mediaRouter.get(
  '/admin/videos',
  Auth.verifyToken,
  media.getAdminAll
)

mediaRouter.get(
  '/admin/videos/:id',
  Auth.verifyToken,
  MiddlewareHandler.middIntId('id'),
  media.getAdminById
)

mediaRouter.put(
  '/videos/update/:id',
  Auth.verifyToken,
  MiddlewareHandler.middIntId('id'),
  MiddlewareHandler.validateFields(mediaUpdate),
  media.update
)

mediaRouter.delete(
  '/videos/:id',
  Auth.verifyToken,
  MiddlewareHandler.middIntId('id'),
  media.delete
)

export default mediaRouter
/* //imagenes
mediaRouter.get('/imgs', auth.verifyToken, media.getImagesController)

mediaRouter.delete('/imgs/:id', auth.verifyToken,  middIntId, media.deleteImagesController)
//videos
mediaRouter.post('/videos/create', auth.verifyToken, validateFields(mediaCreate), media.createMediaController)

mediaRouter.get('/videos',  media.getMediaController)//Ruta libre

mediaRouter.get('/videos/:id',  middIntId, media.getByIdMediaController)//Ruta libre

mediaRouter.get('/admin/videos',auth.verifyToken, media.getAdminMediaController)

mediaRouter.put('/videos/update/:id',  auth.verifyToken,  middIntId, validateFields(mediaUpdate), media.updateMediaController)

mediaRouter.delete('/videos/:id',  auth.verifyToken, middIntId, media.deleteMediaController)
*/
