const orderService = require('../services/orderService');
const asyncHandler = require('../utils/asyncHandler');
const sendSuccess = require('../utils/sendSuccess');

const createOrder = asyncHandler(async (req, res, next) => {
  const { deliveryAddress } = req.body;

  const order = await orderService.createOrder(req.user._id, deliveryAddress);

  sendSuccess(res, { order }, 'Order placed successfully', 201);
});

const getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await orderService.getMyOrders(req.user._id);

  sendSuccess(res, { orders }, 'Orders fetched successfully');
});

const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await orderService.getOrderById(req.params.id, req.user._id);

  sendSuccess(res, { order }, 'Order fetched successfully');
});

const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const order = await orderService.updateOrderStatus(req.params.id, status);

  sendSuccess(res, { order }, 'Order status updated successfully');
});

const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await orderService.cancelOrder(req.params.id, req.user._id);

  sendSuccess(res, { order }, 'Order cancelled successfully');
});

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderStatus, cancelOrder };
