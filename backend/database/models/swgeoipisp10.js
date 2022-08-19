const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('swgeoipisp10', {
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
    isp: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'swgeoipisp10',
    timestamps: false,
    indexes: [
      {
        name: "geoipisp1",
        using: "BTREE",
        fields: [
          { name: "ipto" },
        ]
      },
    ]
  });
};
