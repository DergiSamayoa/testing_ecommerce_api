const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const ProductImg = sequelize.define('productImg', {
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    filename: {
        type: DataTypes.TEXT,
        allowNull: false
    },
},
{
    timestamps: false
});

module.exports = ProductImg;