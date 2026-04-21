const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/postgres');

const OrderLog = sequelize.define('OrderLog', {
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = OrderLog;
