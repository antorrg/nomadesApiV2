import express from 'express'
import MailerService from '../../Shared/Services/MailerService.js'

const mailRouter = express.Router()

mailRouter.post('/', async(req, res)=>{
    const {email, issue, message}= req.body
    const response = await MailerService.senderMail(email, issue, message)
    res.status(200).json({success: true, message: response, results: null})
})

export default mailRouter
