const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const ProductImg = require('./ProductImg');
const Cart = require('./Cart');

Product.belongsTo(Category);
Category.hasMany(Product);

ProductImg.belongsTo(Product);
Product.hasMany(ProductImg);

Cart.belongsTo(User);
User.hasMany(Cart);
Cart.belongsTo(Product);
Product.hasMany(Cart)