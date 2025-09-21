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

async function startUp(syncDb = false, rewrite = false){
    try {
        await sequelize.authenticate();
        if (env.Status !== 'production' && syncDb) {
            try {
                await sequelize.sync({ force: rewrite });
                console.log(`🧪 Synced database: "force: ${rewrite}"`);
            }
            catch (error) {
                console.error('❗Error syncing database', error);
            }
        }
        console.log('🟢​ Database initialized successfully!!');
    }
    catch (error) {
        console.error('❌ Error conecting database!', error);
    }
}
const closeDatabase = async () => {
    await sequelize.close();
    console.log('🛑 Database disconnect');
};
export {
  User,
  Product,
  Item,
  Landing,
  Image,
  Media,
  About,
  Work,
  sequelize,
  startUp,
  closeDatabase
}
