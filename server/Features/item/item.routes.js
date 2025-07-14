import express from 'express'
import { Item } from '../../Configs/database.js'
import GeneralRepository from '../../Shared/Repositories/GeneralRepositoy.js'
import ItemService from './ItemService.js'
import BaseController from '../../Shared/Controllers/BaseController.js'
import MiddlewareHandler from '../../Shared/Middlewares/MiddlewareHandler.js'
import HelperItem from './HelperItem.js'
import ImageHandler from '../../Configs/ImageHandler.js'
import { Auth } from '../../Shared/Auth/Auth.js'

const ItemRep = new GeneralRepository(Item, HelperItem.emptyItem) // Model, dataEmpty
export const itemServ = new ItemService(ItemRep, 'Item', 'text', HelperItem.itemCleaner, true, ImageHandler, 'img')// Repo, fieldName, parserFunction useImage, deleteImages, nameImage
const item = new BaseController(itemServ)

const createItem = [{ name: 'text', type: 'string' }, { name: 'img', type: 'string' }, { name: 'ProductId', type: 'int' }]
const updateItem = [{ name: 'text', type: 'string' }, { name: 'img', type: 'string' }, { name: 'ProductId', type: 'int' }, { name: 'enable', type: 'boolean' }]

const itemRouter = express.Router()

itemRouter.post(
  '/create',
  Auth.verifyToken,
  MiddlewareHandler.validateFields(createItem),
  item.create
)

itemRouter.get(
  '/public/:id',
  MiddlewareHandler.middIntId('id'),
  item.getById
)
itemRouter.get(
  '/',
  Auth.verifyToken,
  MiddlewareHandler.middIntId('id'),
  item.getAdminAll
)
itemRouter.get(
  '/:id',
  Auth.verifyToken,
  MiddlewareHandler.middIntId('id'),
  item.getAdminById
)

itemRouter.put(
  '/:id',
  Auth.verifyToken,
  MiddlewareHandler.middIntId('id'),
  MiddlewareHandler.validateFields(updateItem),
  item.update
)

itemRouter.delete(
  '/:id',
  Auth.verifyToken,
  MiddlewareHandler.middIntId('id'),
  item.delete
)

export default itemRouter
