const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('swchatdata', {
    chatdataid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    chatobjectid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    contents: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'swchatdata',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "chatdataid" },
        ]
      },
      {
        name: "cobjid",
        using: "BTREE",
        fields: [
          { name: "chatobjectid" },
        ]
      },
    ]
  });
};
