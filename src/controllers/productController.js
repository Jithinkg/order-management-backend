const productService = require('../services/productService');
const asyncHandler = require('../utils/asyncHandler');
const sendSuccess = require('../utils/sendSuccess');

const createProduct = asyncHandler(async (req, res, next) => {
  const product = await productService.createProduct(req.body, req.user._id);
  sendSuccess(res, { product }, 'Product created successfully', 201);
});

const getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await productService.getAllProducts();
  sendSuccess(res, { products }, 'Products fetched successfully');
});

const getProductById = asyncHandler(async (req, res, next) => {
  const product = await productService.getProductById(req.params.id);
  sendSuccess(res, { product }, 'Product fetched successfully');
});

const updateProduct = asyncHandler(async (req, res, next) => {
  const product = await productService.updateProduct(req.params.id, req.body, req.user._id);
  sendSuccess(res, { product }, 'Product updated successfully');
});

const deleteProduct = asyncHandler(async (req, res, next) => {
  await productService.deleteProduct(req.params.id, req.user._id);
  sendSuccess(res, null, 'Product deleted successfully');
});

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
