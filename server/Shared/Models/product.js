import { DataTypes } from 'sequelize'

export default (sequelize) => {
  sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: { type: DataTypes.STRING, allowNull: true },
    landing: { type: DataTypes.STRING, allowNull: true },
    info_header: { type: DataTypes.STRING, allowNull: true },
    info_body: { type: DataTypes.TEXT, allowNull: true },
    to_show: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    enable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    deleteAt: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
