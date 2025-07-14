import express from 'express'
import MailerService from '../../Shared/Services/MailerService.js'

const mailRouter = express.Router()

mailRouter.post('/', MailerService.senderMail)

export default mailRouter
