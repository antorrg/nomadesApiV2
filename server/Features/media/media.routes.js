import express from 'express'
import { Media } from '../../Configs/database.js'
import GeneralRepository from '../../Shared/Repositories/GeneralRepositoy.js'
import BaseService from '../../Shared/Services/BaseService.js'
import BaseController from '../../Shared/Controllers/BaseController.js'
import * as imgController from '../image/imgController.js'
import Auth from '../../Shared/Auth/Auth.js'
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
  '/media/imgs',
  imgController.getImagesFromDb
)

mediaRouter.delete(
  '/media/imgs/:id',
  imgController.delImagesFromDb
)

mediaRouter.post(
  '/media/videos/create',
  MiddlewareHandler.validateFields(mediaCreate),
  media.create
)

mediaRouter.get(
  '/media/videos',
  media.getAll
)

mediaRouter.get(
  '/media/videos/:id',
  MiddlewareHandler.middIntId('id'),
  media.getById
)

mediaRouter.get(
  '/media/admin/videos',
  media.getAdminAll
)

mediaRouter.put(
  '/media/videos/update/:id',
  MiddlewareHandler.middIntId('id'),
  MiddlewareHandler.validateFields(mediaUpdate),
  media.update
)

mediaRouter.delete(
  '/media/videos/:id',
  MiddlewareHandler.middIntId('id'),
  media.delete
)

export default mediaRouter
/* //imagenes
mediaRouter.get('/media/imgs', auth.verifyToken, media.getImagesController)

mediaRouter.delete('/media/imgs/:id', auth.verifyToken,  middIntId, media.deleteImagesController)
//videos
mediaRouter.post('/media/videos/create', auth.verifyToken, validateFields(mediaCreate), media.createMediaController)

mediaRouter.get('/media/videos',  media.getMediaController)//Ruta libre

mediaRouter.get('/media/videos/:id',  middIntId, media.getByIdMediaController)//Ruta libre

mediaRouter.get('/media/admin/videos',auth.verifyToken, media.getAdminMediaController)

mediaRouter.put('/media/videos/update/:id',  auth.verifyToken,  middIntId, validateFields(mediaUpdate), media.updateMediaController)

mediaRouter.delete('/media/videos/:id',  auth.verifyToken, middIntId, media.deleteMediaController)
*/
