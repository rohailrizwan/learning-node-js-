import { Product } from '../models/product.model.js';
import ApiError from '../utils/apierror.js';
import Apiresponse from '../utils/apiresponse.js';
import { asyncHandler } from '../utils/asynchandler.js';

const addProduct = asyncHandler(async (req, res) => {
  const {
    product_name,
    category,
    gender,
    rating,
    price,
    size,
    notes,
    image,
    description,
    // optional fields
    isAvailable,
    cover_images,
    sillage,
    longevity,
    occasion,
    season,
    shareLinks,
  } = req.body;

  if (!Array.isArray(notes) || notes.length === 0) {
    throw new ApiError('Notes must be a non-empty array', 401);
  }

  if (!req.user || !req.user._id || req?.user?.role !== 'admin') {
    throw new ApiError('unAuthentcated', 401);
  }
  const requiredFields = [
    { key: 'product_name', label: 'Product Name', type: 'string' },
    { key: 'category', label: 'Category', type: 'string' },
    { key: 'gender', label: 'Gender', type: 'string' },
    { key: 'rating', label: 'Rating', type: 'string' },
    { key: 'price', label: 'Price', type: 'number' },
    { key: 'size', label: 'Size', type: 'string' },
    // { key: 'image', label: 'Image', type: 'string' },
    { key: 'description', label: 'Description', type: 'string' },
  ];

  const ifempty = requiredFields
    .filter(({ key, type }) => {
      const value = req.body[key];

      if (value === undefined || value === null) return true;

      if (type === 'string')
        return typeof value !== 'string' || value.trim() === '';
      if (type === 'number') return isNaN(value);
      if (type === 'array') return !Array.isArray(value) || value.length === 0;

      return false;
    })
    .map(({ key, label }) => ({
      field: key,
      message: `${label} is required`,
    }));

  if (ifempty?.length > 0) {
    throw new ApiError('Fields are missing', 400, ifempty);
  }

  const newproduct = await Product.create({
    product_name,
    category,
    gender,
    rating,
    price,
    size,
    notes,
    image,
    description,
    isAvailable,
    cover_images,
    sillage,
    longevity,
    occasion,
    season,
    shareLinks,
  });

  return res
    .status(200)
    .json(new Apiresponse(200, 'Product created successfully', newproduct));
});

const getProduct = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 2;
  const skip = (page - 1) * limit;
  const searchQuery = req.query.search ? {product_name:{$regex:req.query.search,$options:"i"}}:{}
  console.log(searchQuery,"search");
  
  const getProduct = await Product.find(searchQuery).skip(skip).limit(limit);
  const totalProducts = await Product.countDocuments()
  const totalPages = Math.ceil(totalProducts / limit);
  
  if (getProduct?.length == 0) {
    throw new ApiError('Product not found', 404, getProduct);
  }
  return res.status(200).json(
    new Apiresponse(200, 'Product get', {
      data: getProduct,
      page: page,
      limit: limit,
      totalPages:totalPages
    }),
  );
});

const deleteProduct = asyncHandler(async (req, res) => {
  console.log(req?.user);
  if (!req.user || !req.user._id || req?.user?.role !== 'admin') {
    throw new ApiError('unAuthentcated', 401);
  }
  const getid = req.params.id;
  console.log(getid);

  const delete_product = await Product.findByIdAndDelete(getid);

  if (!delete_product) {
    throw new ApiError('Product not found', 404);
  }
  return res
    .status(200)
    .json(new Apiresponse(200, 'Product deleted successfully'));
});
const getProductByid = asyncHandler(async (req, res) => {
  console.log(req?.user);
  // if (!req.user || !req.user._id || req?.user?.role !== 'admin') {
  //   throw new ApiError('unAuthentcated', 401);
  // }
  const getid = req.params.id;
 
  const getData = await Product.findById(getid);

  
  if (!getData) {
    throw new ApiError('Product not found', 404);
  }
 return res.status(200).json({
  success: true,
  message: 'Product fetch successfully',
  data: getData
});

});

const updateProduct = asyncHandler(async (req, res) => {
  const {
    product_name,
    category,
    gender,
    rating,
    price,
    size,
    notes,
    image,
    description,
    // optional fields
    isAvailable,
    cover_images,
    sillage,
    longevity,
    occasion,
    season,
    shareLinks,
  } = req.body;

  if (!req.user || !req.user._id || req?.user?.role !== 'admin') {
    throw new ApiError('unAuthentcated', 401);
  }

  const requiredFields = [
    { key: 'product_name', label: 'Product Name', type: 'string' },
    { key: 'category', label: 'Category', type: 'string' },
    { key: 'gender', label: 'Gender', type: 'string' },
    { key: 'rating', label: 'Rating', type: 'string' },
    { key: 'price', label: 'Price', type: 'number' },
    { key: 'size', label: 'Size', type: 'string' },
    // { key: 'image', label: 'Image', type: 'string' },
    { key: 'description', label: 'Description', type: 'string' },
  ];

  const ifempty = requiredFields
    .filter(({ key, type }) => {
      const value = req.body[key];

      if (value === undefined || value === null) return true;

      if (type === 'string')
        return typeof value !== 'string' || value.trim() === '';
      if (type === 'number') return isNaN(value);
      if (type === 'array') return !Array.isArray(value) || value.length === 0;

      return false;
    })
    .map(({ key, label }) => ({
      field: key,
      message: `${label} is required`,
    }));

  if (ifempty?.length > 0) {
    throw new ApiError('Fields are missing', 400, ifempty);
  }

  const getid = req.params.id;

  const updateProduct = await Product.findByIdAndUpdate(
    getid,
    {
      product_name,
      category,
      gender,
      rating,
      price,
      size,
      notes,
      // image,
      description,
      // optional fields
      isAvailable,
      cover_images,
      sillage,
      longevity,
      occasion,
      season,
      shareLinks,
    },
    { new: true, runValidators: true },
  );

  if (!updateProduct) {
    throw new ApiError('Not updated', 500);
  }
  if (updateProduct) {
    return res
      .status(200)
      .json(new Apiresponse(200, 'Product updated successfully', updateProduct));
  }
});

export { addProduct, getProduct, deleteProduct, updateProduct, getProductByid };
