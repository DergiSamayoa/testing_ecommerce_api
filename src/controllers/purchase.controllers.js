const catchError = require('../utils/catchError');
const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');

const getAll = catchError(async(req, res) => {
    const userId = req.user.id;
    const results = await Purchase.findAll({ 
                            where: { userId }, 
                            include: [
                                {
                                    model: Product, 
                                    attributes: { 
                                        exclude: ["createdAt", "updatedAt"] 
                                    },
                                    include: {
                                        model: Category,
                                        attributes: ["name"]
                                    } 
                                }, 
                                {
                                    model: User, 
                                    attributes: { exclude: ["createdAt", "updatedAt", "id", "password"] } 
                                }
                            ] 
                        });
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const userId = req.user.id;
    const cart = await Cart.findAll({
        where: { userId }, 
        raw: true,
        attributes: ["quantity", "productId", "userId"]
    });
    if(!cart) return res.sendStatus(404);
    const result = await Purchase.bulkCreate(cart);
    if(!result) return res.sendStatus(404);
    await Cart.destroy({ where: { userId }  });
    return res.status(201).json(result);
});

module.exports = {
    getAll,
    create
}