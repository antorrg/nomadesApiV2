import express from 'express'
import { Product} from '../../Configs/database.js'
import GeneralRepository from '../../Shared/Repositories/GeneralRepositoy.js'
import ProductService from './ProducService.js'
import itemRouter, { itemServ } from '../item/item.routes.js'
import BaseController from '../../Shared/Controllers/BaseController.js'
import ImageHandler from '../../Configs/ImageHandler.js'
import HelperProduct from './HelperProduct.js'
import MiddlewareHandler from '../../Shared/Middlewares/MiddlewareHandler.js'

const prodRep = new GeneralRepository(Product)
export const productService = new ProductService(
  prodRep,
  'Product',
  'title',
  HelperProduct.cleanerProduct,
  true,
  ImageHandler,
  'landing',
  itemServ,
  'Item',
  'text',
  'img'
)
const product = new BaseController(productService)
const productRouter = express.Router()

productRouter.use('/item',itemRouter)

productRouter.get(
  '/',
  product.getAll
)

productRouter.get(
  '/',
  product.getAdminAll
)

productRouter.get(
  '/:id',
  MiddlewareHandler.middIntId('id'),
  product.getById
)

productRouter.post(
  '/create',
  product.create
)

productRouter.put(
  '/:id',
  MiddlewareHandler.middIntId('id'),
  product.update
)

productRouter.delete(
  '/:id',
  MiddlewareHandler.middIntId('id'),
  product.delete
)

export default productRouter
