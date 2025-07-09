import BaseController from '../../Shared/Controllers/BaseController.js'
import eh from '../../Configs/errorHandlers.js'

export default class UserController extends BaseController {
  constructor (service) {
    super(service)
  }

  login = eh.catchController(async (req, res) => {
    const data = req.body
    const response = await this.service.login(data)
    return BaseController.oldResp(200, response.data)
  })

  verifyPass = eh.catchController(async (req, res) => {
    const data = req.body
    const response = await this.service.login(data)
    return BaseController.oldResp(200, response.message)
  })
}
