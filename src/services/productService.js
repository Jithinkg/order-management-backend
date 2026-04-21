const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const redis = require('../config/redis');

const CACHE_KEY = 'products';
const CACHE_TTL = 300; // 5 minutes in seconds

const createProduct = async (productData, userId) => {
  const product = await Product.create({ ...productData, owner: userId });
  await redis.del(CACHE_KEY);
  return product;
};

const getAllProducts = async () => {
  const cached = await redis.get(CACHE_KEY);
  if (cached) {
    return JSON.parse(cached);
  }

  const products = await Product.find({ isAvailable: true }).populate('owner', 'name email');
  await redis.set(CACHE_KEY, JSON.stringify(products), 'EX', CACHE_TTL);
  return products;
};

const getProductById = async (id) => {
  const product = await Product.findById(id).populate('owner', 'name email');
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  return product;
};

const updateProduct = async (id, updateData, userId) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (product.owner.toString() !== userId.toString()) {
    throw new AppError('You are not authorized to modify this product', 403);
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  await redis.del(CACHE_KEY);
  return updatedProduct;
};

const deleteProduct = async (id, userId) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (product.owner.toString() !== userId.toString()) {
    throw new AppError('You are not authorized to delete this product', 403);
  }

  await Product.findByIdAndDelete(id);
  await redis.del(CACHE_KEY);
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
