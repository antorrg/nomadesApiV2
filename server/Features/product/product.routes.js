import express from 'express'
import { Product } from '../../Configs/database.js'
import GeneralRepository from '../../Shared/Repositories/GeneralRepositoy.js'
import ProductService from './ProducService.js'
import itemRouter, { itemServ } from '../item/item.routes.js'
import BaseController from '../../Shared/Controllers/BaseController.js'
import ImgsService from '../../Shared/Services/ImgsService.js'
import HelperProduct from './HelperProduct.js'
import { Validator } from 'req-valid-express'
import * as schemas from './productschemas.mjs'
import { Auth } from '../../Shared/Auth/Auth.js'

const prodRep = new GeneralRepository(Product, HelperProduct.emptyProduct)
export const productService = new ProductService(
  prodRep,
  'Product',
  'title',
  HelperProduct.cleanerProduct,
  true,
  ImgsService,
  'landing',
  itemServ,
  'Item',
  'text',
  'img'
)
const product = new BaseController(productService)
const productRouter = express.Router()

productRouter.use('/item', itemRouter)

productRouter.get(
  '/public',
  product.getAll
)

productRouter.get(
  '/',
  Auth.verifyToken,
  product.getAdminAll
)

productRouter.get(
  '/public/:id',
  Validator.paramId('id', Validator.ValidReg.INT),
  product.getById
)
productRouter.get(
  '/:id',
  Auth.verifyToken,
  Validator.paramId('id', Validator.ValidReg.INT),
  product.getAdminById
)

productRouter.post(
  '/create',
  Auth.verifyToken,
  Validator.validateBody(schemas.create),
  product.create
)

productRouter.put(
  '/:id',
  Auth.verifyToken,
  Validator.paramId('id', Validator.ValidReg.INT),
  Validator.validateBody(schemas.update),
  product.update
)

productRouter.delete(
  '/:id',
  Auth.verifyToken,
  Validator.paramId('id', Validator.ValidReg.INT),
  product.delete
)

export default productRouter
