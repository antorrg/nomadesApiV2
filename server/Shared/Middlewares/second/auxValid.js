export class AuxValid {
  static middError (message, status = 500) {
    const error = new Error(message)
    error.status = status
    return error
  }

  // Nueva función para manejar valores por defecto según el tipo
  static getDefaultValue (type) {
    switch (type) {
      case 'boolean': return false
      case 'int': return 1
      case 'float': return 1.0
      case 'string': return ''
      default: return null
    }
  }

  static validateBoolean (value) {
    if (typeof value === 'boolean') return value
    if (value === 'true') return true
    if (value === 'false') return false
    throw new Error('Invalid boolean value')
  }

  static validateInt (value) {
    const intValue = Number(value)
    if (isNaN(intValue) || !Number.isInteger(intValue)) throw new Error('Invalid integer value')
    return intValue
  }

  static validateFloat (value) {
    const floatValue = parseFloat(value)
    if (isNaN(floatValue)) throw new Error('Invalid float value')
    return floatValue
  }

  // Nueva función para aislar la lógica de validación
  static validateValue (value, fieldType, fieldName, itemIndex = null) {
    const indexInfo = itemIndex !== null ? ` in item[${itemIndex}]` : ''

    switch (fieldType) {
      case 'boolean':
        return AuxValid.validateBoolean(value)
      case 'int':
        return AuxValid.validateInt(value)
      case 'float':
        return AuxValid.validateFloat(value)
      case 'array':
        if (!Array.isArray(value)) {
          throw new Error(`Invalid array value for field ${fieldName}${indexInfo}`)
        }
        return value
      case 'string':
      default:
        if (typeof value !== 'string') {
          throw new Error(`Invalid string value for field ${fieldName}${indexInfo}`)
        }
        return value
    }
  }
}
