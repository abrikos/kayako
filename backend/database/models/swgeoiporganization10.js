const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('swgeoiporganization10', {
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
    tableName: 'swgeoiporganization10',
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
