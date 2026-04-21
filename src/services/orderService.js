const { Order, ORDER_STATUS } = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const { publishEvent } = require('../config/producer');
const OrderLog = require('../models/OrderLog');

const createOrder = async (userId, deliveryAddress) => {
  const cart = await Cart.findOne({ customer: userId }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    throw new AppError('Your cart is empty', 400);
  }

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
  }));

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = await Order.create({
    customer: userId,
    items: orderItems,
    totalAmount,
    deliveryAddress,
  });

  cart.items = [];
  await cart.save();

  await publishEvent('order.placed', {
    orderId: order._id,
    customerId: userId,
    totalAmount,
  });

  return order;
};

const getMyOrders = async (userId) => {
  const orders = await Order.find({ customer: userId }).sort({ createdAt: -1 });
  return orders;
};

const getOrderById = async (orderId, userId) => {
  const order = await Order.findById(orderId);
  if (!order) throw new AppError('Order not found', 404);
  if (order.customer.toString() !== userId.toString()) {
    throw new AppError('You are not authorized to view this order', 403);
  }
  return order;
};

const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) throw new AppError('Order not found', 404);

  if (!Object.values(ORDER_STATUS).includes(status)) {
    throw new AppError('Invalid status', 400);
  }

  order.status = status;
  await order.save();

  await OrderLog.create({
    orderId: order._id.toString(),
    customerId: order.customer.toString(),
    status: order.status,
    totalAmount: order.totalAmount,
  });

  return order;
};

const cancelOrder = async (orderId, userId) => {
  const order = await Order.findById(orderId);
  if (!order) throw new AppError('Order not found', 404);

  if (order.customer.toString() !== userId.toString()) {
    throw new AppError('You are not authorized to cancel this order', 403);
  }

  if (order.status !== ORDER_STATUS.PENDING) {
    throw new AppError('Only pending orders can be cancelled', 400);
  }

  order.status = ORDER_STATUS.CANCELLED;
  await order.save();

  await OrderLog.create({
    orderId: order._id.toString(),
    customerId: order.customer.toString(),
    status: order.status,
    totalAmount: order.totalAmount,
  });

  return order;
};

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderStatus, cancelOrder };
