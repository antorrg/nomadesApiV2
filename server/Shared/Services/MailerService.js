import nodemailer from 'nodemailer'
import env from '../../Configs/envConfig.js'
import eh from '../../Configs/errorHandlers.js'


export default {
  senderMail: async (email, issue, message) => {
    // este console.log de arriba me da que la info es correcta: email es el remitente,
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      service: 'gmail',
      auth: {
        user: env.gmailUser,
        pass: env.gmailPass
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    // Configuración del correo electrónico
    const mailOptions = {
      from: email,
      to: env.gmailUser,
      subject: issue,
      text: message,
      replyTo: email
    }
    try {
      console.log({ mailOptions })
      await transporter.sendMail(mailOptions)
      return 'Mensaje enviado exitosamente'
    } catch (error) {
      console.error('Error al enviar el correo:', error)
      eh.throwError('Error al enviar el correo:', 500)
    }
  }
}
