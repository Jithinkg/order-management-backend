const Cart = require('../models/Cart');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');

const addToCart = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) throw new AppError('Product not found', 404);
  if (!product.isAvailable) throw new AppError('Product is not available', 400);

  let cart = await Cart.findOne({ customer: userId });

  if (!cart) {
    cart = await Cart.create({ customer: userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId.toString()
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  return cart;
};

const getCart = async (userId) => {
  const cart = await Cart.findOne({ customer: userId }).populate(
    'items.product',
    'name price isAvailable'
  );

  if (!cart) throw new AppError('Cart is empty', 404);
  return cart;
};

const removeItem = async (userId, productId) => {
  const cart = await Cart.findOne({ customer: userId });
  if (!cart) throw new AppError('Cart not found', 404);

  const itemExists = cart.items.find(
    (item) => item.product.toString() === productId.toString()
  );
  if (!itemExists) throw new AppError('Item not in cart', 404);

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );

  await cart.save();
  return cart;
};

const clearCart = async (userId) => {
  const cart = await Cart.findOne({ customer: userId });
  if (!cart) throw new AppError('Cart not found', 404);

  cart.items = [];
  await cart.save();
};

module.exports = { addToCart, getCart, removeItem, clearCart };
