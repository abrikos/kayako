const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('swgeoiporganization2', {
    ipfrom: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    ipto: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    organization: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'swgeoiporganization2',
    timestamps: false,
    indexes: [
      {
        name: "geoiporganization1",
        using: "BTREE",
        fields: [
          { name: "ipto" },
        ]
      },
    ]
  });
};
