require('../models');
const request = require("supertest")
const app = require("../app")
const Cart = require("../models/Cart");
const Purchase = require('../models/Purchase');
const Product = require('../models/Product');

const PURCHASE_URL = '/purchase';

let TOKEN;
let userId;
let bodyCart;
let product;
let bodyProduct;

beforeAll(async () => {
    console.log("BEFORE ALL PURCHASE TESTS");
    const USER_URL = '/users/login'
    const user = {
        email: "juan@gmail.com",
        password: "juan1234"
    }

    const response = await request(app)
        .post(USER_URL)
        .send(user);
    TOKEN = response.body.token;
    userId = response.body.user.id;

    bodyProduct = {
        title: 'Playera',
        description: 'lorem21',
        price: 45.45,
    }
    product = await Product.create(bodyProduct);

    bodyCart = {
        quantity: 3,
        productId: product.id
    }
    await request(app)
        .post('/cart')
        .send(bodyCart)
        .set('Authorization', `Bearer ${TOKEN}`);
});

afterAll(async () => {
    await Purchase.destroy({ where: { userId } });
    await Product.destroy({ where: { id: product.id } });
});

test("POST -> 'PURCHASE_URL', should return status code 201, res.body to be defined and res.body.quantity === bodyCart.quantity", async () => {
    console.log("CREATE PURCHASE");
    const response = await request(app)
        .post(PURCHASE_URL)
        .set('Authorization', `Bearer ${TOKEN}`);
    console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body[0]).toBeDefined();
    expect(response.body[0].quantity).toBe(bodyCart.quantity);
    expect(response.body[0].userId).toBe(userId);
});

test("GET -> 'PURCHASE_URL', should return status code 200, res.body to be defined and res.body.length === 1", async () => {
    console.log("GET PURCHASES");
    const response = await request(app)
        .get(PURCHASE_URL)
        .set('Authorization', `Bearer ${TOKEN}`);
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveLength(1);

    expect(response.body[0].productId).toBeDefined();
    expect(response.body[0].productId).toBe(product.id);

    expect(response.body[0].userId).toBeDefined();
    expect(response.body[0].userId).toBe(userId);

});