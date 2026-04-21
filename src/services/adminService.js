const { Order } = require('../models/Order');
const User = require('../models/User');

const getAllOrders = async () => {
  const orders = await Order.find()
    .populate('customer', 'name email')
    .sort({ createdAt: -1 });
  return orders;
};

const getAllUsers = async () => {
  const users = await User.find().select('-password');
  return users;
};

const getOrderStats = async () => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        revenue: { $sum: '$totalAmount' },
      },
    },
  ]);
  return stats;
};

module.exports = { getAllOrders, getAllUsers, getOrderStats };
