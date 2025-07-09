import { Sequelize } from 'sequelize'
import models from '../Shared/Models/index.js'
import env from './envConfig.js'

const sequelize = new Sequelize(env.DatabaseUrl, {
  logging: false,
  native: false,
  dialectOptions: env.optionRender
    ? {
        ssl: {
          require: true
        }
      }
    : {}
})

Object.values(models).forEach((model) => model(sequelize))

const {
  User,
  Product,
  Item,
  Landing,
  Image,
  Media,
  About,
  Work
} = sequelize.models

// Asociations:
Product.hasMany(Item)
Item.belongsTo(Product)

export {
  User,
  Product,
  Item,
  Landing,
  Image,
  Media,
  About,
  Work,
  sequelize
}
