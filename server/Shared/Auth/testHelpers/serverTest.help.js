import express from 'express'
import eh from '../../../Configs/errorHandlers.js'
import { Auth } from '../Auth.js'

const serverTest = express()
serverTest.use(express.json())

serverTest.post('/', Auth.verifyToken, eh.catchController(async (req, res) => {
  const data = req.body
  const decoResponse = req.userInfo
  res.status(200).json({ success: true, message: 'Passed middleware', data, userInfo: decoResponse })
}))

serverTest.post('/roleUser', Auth.verifyToken, Auth.checkRole([1]), eh.catchController(async (req, res) => {
  const data = req.body
  const decoResponse = req.userInfo
  res.status(200).json({ success: true, message: 'Passed middleware', data, userInfo: decoResponse })
}))

serverTest.get('/emailVerify', Auth.verifyEmailToken, eh.catchController(async (req, res) => {
  const decoResponse = req.userInfo
  res.status(200).json({ success: true, message: 'Passed middleware', data: null, userInfo: decoResponse })
}))

serverTest.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'Internal server error'
  res.status(status).json({
    success: false,
    message,
    data: null
  })
})
export default serverTest
