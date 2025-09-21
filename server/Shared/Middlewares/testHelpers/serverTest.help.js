import express from 'express'
import MiddlewareHandle from '../MiddlewareHandler.js'

// Los metodos son: validateField, validateFieldWithItems, middUuid, midIntId, validateRegex
// Para validateField y validateFieldWithItems los parametros van acompañados de su tipo en minuscula:
const firstItems = [
  { name: 'name', type: 'string' },
  { name: 'amount', type: 'int' },
  { name: 'price', type: 'float' },
  { name: 'enable', type: 'boolean' },
  { name: 'arreglo', type: 'array' }
]
const secondItem = [
  { name: 'name', type: 'string' },
  { name: 'picture', type: 'string' },
  { name: 'enable', type: 'boolean' },
  { name: 'arreglo', type: 'array' }
]

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const queries = [
  { name: 'page', type: 'int' },
  { name: 'size', type: 'float' },
  { name: 'fields', type: 'string' },
  { name: 'truthy', type: 'boolean' }
]

const serverTest = express()
serverTest.use(express.json())

serverTest.post(
  '/test/body/create',
  MiddlewareHandle.validateFields(firstItems),
  (req, res) => {
    res.status(200).json({ message: 'Passed middleware', data: req.body })
  }
)

serverTest.post(
  '/test/body/extra/create',
  MiddlewareHandle.validateFieldsWithItems(firstItems, secondItem, 'items'),
  (req, res) => {
    res.status(200).json({ message: 'Passed middleware', data: req.body })
  }
)

serverTest.post(
  '/test/user',
  MiddlewareHandle.validateRegex(
    emailRegex,
    'email',
    'Introduzca un mail valido'
  ),
  (req, res) => {
    res.status(200).json({ message: 'Passed middleware', data: req.body })
  }
)

serverTest.get(
  '/test/param',
  MiddlewareHandle.validateQuery(queries),
  (req, res) => {
    res.status(200).json({ message: 'Passed middleware', data: req.query, validData: req.context.query// req.validatedQuery
    })
  }
)

serverTest.get(
  '/test/param/:id',
  MiddlewareHandle.middUuid('id'),
  (req, res) => {
    res.status(200).json({ message: 'Passed middleware' })
  })

serverTest.get(
  '/test/param/int/:id',
  MiddlewareHandle.middIntId('id'),
  (req, res) => {
    res.status(200).json({ message: 'Passed middleware' })
  }
)

serverTest.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || err.stack
  res.status(status).json(message)
})

export default serverTest
