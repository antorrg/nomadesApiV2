import express from 'express'
import { Item } from '../../Configs/database.js'
import GeneralRepository from '../../Shared/Repositories/GeneralRepositoy.js'
import ItemService from './ItemService.js'
import BaseController from '../../Shared/Controllers/BaseController.js'
import MiddlewareHandler from '../../Shared/Middlewares/MiddlewareHandler.js'
import HelperItem from './HelperItem.js'
import ImageHandler from '../../Configs/ImageHandler.js'

const ItemRep = new GeneralRepository(Item) // Model, dataEmpty
export const itemServ = new ItemService(ItemRep, 'Item', 'text', HelperItem.itemCleaner, true, ImageHandler, 'img')// Repo, fieldName, parserFunction useImage, deleteImages, nameImage
const item = new BaseController(itemServ)

const createItem = [{ name: 'text', type: 'string' }, { name: 'img', type: 'string' }, { name: 'ProductId', type: 'int' }]
const updateItem = [{ name: 'text', type: 'string' }, { name: 'img', type: 'string' }, { name: 'ProductId', type: 'int' }, { name: 'enable', type: 'boolean' }]

const itemRouter = express.Router()

itemRouter.post(
  '/',
  MiddlewareHandler.validateFields(createItem),
  item.create
)

itemRouter.get(
  '/:id',
  MiddlewareHandler.middIntId('id'),
  item.getById
)

itemRouter.put(
  '/:id',
  MiddlewareHandler.middIntId('id'),
  MiddlewareHandler.validateFields(updateItem),
  item.update
)

itemRouter.delete(
  '/:id',
  MiddlewareHandler.middIntId('id'),
  item.delete
)

export default itemRouter
