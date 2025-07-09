import { DataTypes } from 'sequelize'

export default (sequelize) => {
  sequelize.define('Image', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    scopes: {
      enabledOnly: {
        where: {
          enable: true
        }
      },
      allRecords: {} // No aplica ningún filtro
    },
    timestamps: false
  })
}
