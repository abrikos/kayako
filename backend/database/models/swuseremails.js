const Sequelize = require('sequelize');
const md5 = require("md5");
module.exports = function(sequelize, DataTypes) {
  const Model = sequelize.define('swuseremails', {
    useremailid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    linktype: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0
    },
    isAdmin: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0
    },
    linktypeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    resetpassword: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    isprimary: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0
    },
    userpassword: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "",
      set(value) {
        this.setDataValue('userpassword', md5(value));
      }
    },
  }, {
    sequelize,
    tableName: 'swuseremails',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "useremailid" },
        ]
      },
      {
        name: "useremails1",
        using: "BTREE",
        fields: [
          { name: "linktype" },
          { name: "linktypeid" },
          { name: "isprimary" },
        ]
      },
      {
        name: "useremails2",
        using: "BTREE",
        fields: [
          { name: "linktype" },
          { name: "email" },
        ]
      },
      {
        name: "useremails3",
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "useremails4",
        using: "BTREE",
        fields: [
          { name: "linktype" },
          { name: "useremailid" },
        ]
      },
    ]
  });
  Model.prototype.checkPassword = function (password) {
    return this.userpassword === md5(password)
  };
  return Model;
};
