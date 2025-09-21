import express from 'express'
import { Item } from '../../Configs/database.js'
import GeneralRepository from '../../Shared/Repositories/GeneralRepositoy.js'
import ItemService from './ItemService.js'
import BaseController from '../../Shared/Controllers/BaseController.js'
import { Validator } from 'req-valid-express'
import HelperItem from './HelperItem.js'
import ImgsService from '../../Shared/Services/ImgsService.js'
import { Auth } from '../../Shared/Auth/Auth.js'
import * as schemas from './itemSchemas.mjs'

const ItemRep = new GeneralRepository(Item, HelperItem.emptyItem) // Model, dataEmpty
export const itemServ = new ItemService(ItemRep, 'Item', 'text', HelperItem.itemCleaner, true, ImgsService, 'img')// Repo, fieldName, parserFunction useImage, deleteImages, nameImage
const item = new BaseController(itemServ)

const itemRouter = express.Router()

itemRouter.post(
  '/create',
  Auth.verifyToken,
  Validator.validateBody(schemas.itemCreate),
  item.create
)

itemRouter.get(
  '/public/:id',
  Validator.paramId('id', Validator.ValidReg.INT),
  item.getById
)
itemRouter.get(
  '/',
  Auth.verifyToken,
  Validator.paramId('id', Validator.ValidReg.INT),
  item.getAdminAll
)
itemRouter.get(
  '/:id',
  Auth.verifyToken,
  Validator.paramId('id', Validator.ValidReg.INT),
  item.getAdminById
)

itemRouter.put(
  '/:id',
  Auth.verifyToken,
  Validator.paramId('id', Validator.ValidReg.INT),
  Validator.validateBody(schemas.itemUpdate),
  item.update
)

itemRouter.delete(
  '/:id',
  Auth.verifyToken,
 Validator.paramId('id', Validator.ValidReg.INT),
  item.delete
)

export default itemRouter
