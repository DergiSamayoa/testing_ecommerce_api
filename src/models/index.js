const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const ProductImg = require('../models/ProductImg');

Product.belongsTo(Category);
Category.hasMany(Product);

ProductImg.belongsTo(Product);
Product.hasMany(ProductImg);