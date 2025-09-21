import eh from '../../Configs/errorHandlers.js'
const catchController = eh.catchController

export default class BaseController {
  constructor (service) {
    this.service = service
  }

  static oldResp (res, status, results) {
    res.status(status).json(results)
  }

  // Controllers:
  create = catchController(async (req, res) => {
    const data = req.body
    console.log('create: ', data)
    const response = await this.service.create(data)
    return BaseController.oldResp(
      res,
      201,
      response.data
    )
  })

  getAll = catchController(async (req, res) => {
    const isAdmin = false
    const response = await this.service.getAll(isAdmin)
    return BaseController.oldResp(
      res,
      200,
      response.data
    )
  })

  getAdminAll = catchController(async (req, res) => {
    const isAdmin = true
    const response = await this.service.getAll(isAdmin)
    return BaseController.oldResp(
      res,
      200,
      response.data
    )
  })

  getWithPagination = catchController(async (req, res) => {
    const response = await this.service.getWithPagination()
    return BaseController.oldResp(
      res,
      200,
      response.data
    )
  })

  getAdminWithPagination = catchController(async (req, res) => {
    const isAdmin = true
    const filters = req.context.query
    const response = await this.service.getWithPagination(filters, isAdmin)
    return BaseController.oldResp(
      res,
      200,
      response.data
    )
  })

  getById = catchController(async (req, res) => {
    const isAdmin = false
    const { id } = req.params
    const response = await this.service.getById(id, isAdmin)
    return BaseController.oldResp(
      res,
      200,
      response.data
    )
  })

  getAdminById = catchController(async (req, res) => {
    const isAdmin = true
    const { id } = req.params
    const response = await this.service.getById(id, isAdmin)
    return BaseController.oldResp(
      res,
      200,
      response.data
    )
  })

  update = catchController(async (req, res) => {
    const { id } = req.params
    const newData = req.body
    const response = await this.service.update(id, newData)
    return BaseController.oldResp(
      res,
      200,
      {
        message: response.message,
        results: response.data
      }
    )
  })

  delete = catchController(async (req, res) => {
    const { id } = req.params
    const response = await this.service.delete(id)
    return BaseController.oldResp(
      res,
      200,
      response.message
    )
  })
}
