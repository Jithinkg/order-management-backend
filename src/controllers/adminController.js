const adminService = require('../services/adminService');
const asyncHandler = require('../utils/asyncHandler');
const sendSuccess = require('../utils/sendSuccess');

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await adminService.getAllOrders();
  sendSuccess(res, { orders }, 'All orders fetched successfully');
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await adminService.getAllUsers();
  sendSuccess(res, { users }, 'All users fetched successfully');
});

const getOrderStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getOrderStats();
  sendSuccess(res, { stats }, 'Order stats fetched successfully');
});

module.exports = { getAllOrders, getAllUsers, getOrderStats };
