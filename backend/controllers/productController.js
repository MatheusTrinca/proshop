import Product from '../models/productModel.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 2;
  const page = Number(req.query.pageNumber) || 1;

  const totalCount = await Product.countDocuments();

  const products = await Product.find({})
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  res.json({ products, page, pages: Math.ceil(totalCount / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    throw new Error('Resource not found');
  }
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createProduct = await product.save();
  res.status(201).json(createProduct);
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Resource not found');
  }

  product.name = name;
  product.price = price;
  product.description = description;
  product.image = image;
  product.brand = brand;
  product.category = category;
  product.countInStock = countInStock;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Resource not found');
  }

  await Product.deleteOne({ _id: product._id });

  res.status(200).json({ message: 'Product removed' });
});

// @desc    Create product review
// @route   POST /api/products/:id/review
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Resource not found');
  }

  const alreadyExistsReview = product.reviews.find(
    r => r.user.toString() === req.user._id.toString()
  );

  if (alreadyExistsReview) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  const review = {
    name: req.user.name,
    rating: Number(req.body.rating),
    comment: req.body.comment,
    user: req.user._id,
  };

  product.reviews.push(review);

  product.numReviews = product.reviews.length;

  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();

  res.status(201).json({ message: 'Review added' });
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};
