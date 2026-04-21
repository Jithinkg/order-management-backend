const cartService = require('../services/cartService');
const asyncHandler = require('../utils/asyncHandler');
const sendSuccess = require('../utils/sendSuccess');

const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const cart = await cartService.addToCart(req.user._id, productId, quantity);

  sendSuccess(res, { cart }, 'Item added to cart', 201);
});

const getCart = asyncHandler(async (req, res, next) => {
  const cart = await cartService.getCart(req.user._id);

  sendSuccess(res, { cart }, 'Cart fetched successfully');
});

const removeItem = asyncHandler(async (req, res, next) => {
  const cart = await cartService.removeItem(req.user._id, req.params.productId);

  sendSuccess(res, { cart }, 'Item removed from cart');
});

const clearCart = asyncHandler(async (req, res, next) => {
  await cartService.clearCart(req.user._id);

  sendSuccess(res, null, 'Cart cleared');
});

module.exports = { addToCart, getCart, removeItem, clearCart };
