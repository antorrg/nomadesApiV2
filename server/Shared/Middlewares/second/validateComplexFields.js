import { AuxValid } from './auxValid.js'

export class ValidateComplexFields {
  static validateFieldsWithItems (requiredFields = [], secondFields = [], arrayFieldName) {
    return (req, res, next) => {
      try {
        // Copiar datos del body
        const firstData = { ...req.body } // Datos principales
        const secondData = Array.isArray(req.body[arrayFieldName])
          ? [...req.body[arrayFieldName]] // Array dinámico
          : null

        // Validar existencia de 'firstData'
        if (!firstData || Object.keys(firstData).length === 0) {
          return next(AuxValid.middError('Invalid parameters', 400))
        }

        // Verificar campos faltantes en 'firstData'
        const missingFields = requiredFields.filter((field) => !(field.name in firstData))
        if (missingFields.length > 0) {
          return next(AuxValid.middError(`Missing parameters: ${missingFields.map(f => f.name).join(', ')}`, 400))
        }

        try {
          requiredFields.forEach(field => {
            const value = firstData[field.name]
            firstData[field.name] = AuxValid.validateValue(value, field.type, field.name)
          })

          // Filtrar campos adicionales no permitidos en `firstData`
          Object.keys(firstData).forEach(key => {
            if (!requiredFields.some(field => field.name === key)) {
              delete firstData[key]
            }
          })
        } catch (error) {
          return next(AuxValid.middError(error.message, 400))
        }

        // Validar existencia y estructura de `secondData`
        if (!secondData || secondData.length === 0) {
          return next(AuxValid.middError(`Missing ${arrayFieldName} array or empty array`, 400))
        }

        // Validar contenido de 'secondData' (no debe contener strings)
        const invalidStringItems = secondData.filter((item) => typeof item === 'string')
        if (invalidStringItems.length > 0) {
          return next(
            AuxValid.middError(
              `Invalid "${arrayFieldName}" content: expected objects but found strings (e.g., ${invalidStringItems[0]})`,
              400
            )
          )
        }

        // Validar cada objeto dentro de 'secondData'
        const validatedSecondData = secondData.map((item, index) => {
          const missingItemFields = secondFields.filter((field) => !(field.name in item))
          if (missingItemFields.length > 0) {
            return next(AuxValid.middError(
              `Missing parameters in ${arrayFieldName}[${index}]: ${missingItemFields.map(f => f.name).join(', ')}`,
              400
            ))
          }

          // Validar tipos de campos en cada `item` usando la función aislada
          secondFields.forEach(field => {
            const value = item[field.name]
            item[field.name] = AuxValid.validateValue(value, field.type, field.name, index)
          })

          // Filtrar campos adicionales en cada `item`
          return secondFields.reduce((acc, field) => {
            acc[field.name] = item[field.name]
            return acc
          }, {})
        })

        // Actualizar `req.body` con datos validados
        req.body = {
          ...firstData,
          [arrayFieldName]: validatedSecondData // Asignar dinámicamente
        }

        // Continuar al siguiente middleware
        next()
      } catch (err) {
        return next(AuxValid.middError(err.message, 400)) // Manejar errores
      }
    }
  }
}
