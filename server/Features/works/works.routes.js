import express from 'express'
import { Work } from '../../Configs/database.js'
import GeneralRepository from '../../Shared/Repositories/GeneralRepositoy.js'
import BaseService from '../../Shared/Services/BaseService.js'
import BaseController from '../../Shared/Controllers/BaseController.js'
import ImageHandler from '../../Configs/ImageHandler.js'

const workRouter = express.Router()

export default workRouter
