const request = require('supertest');
const app = require('../app');

require('../models');

const BASE_URL = '/products';
let product;
let category;
let TOKEN;
let productId;
let categoryId;

beforeAll(async () => {
    const user = {
        email: "juan@gmail.com",
        password: "juan1234"
    };
    const response = await request(app)
                            .post('/users/login')
                            .send(user);
    TOKEN = response.body.token;

    const responseCategory = await request(app)
                                    .post('/categories')
                                    .send({ name: 'Electrodomésticos' })
                                    .set('Authorization', `Bearer ${TOKEN}`);
    category = responseCategory.body;
    categoryId = responseCategory.body.id;

    product = {
        title: 'Horno microondas',
        description: 'Horno microondas de acero inoxidable',
        price: 100.99,
        categoryId: categoryId
    };
});

afterAll(async () => {
    // delete the Product
    await request(app)
            .delete(`${BASE_URL}/${productId}`)
            .set('Authorization', `Bearer ${TOKEN}`);
    // delete the Category
    await request(app)
            .delete(`/categories/${categoryId}`)
            .set('Authorization', `Bearer ${TOKEN}`);
});

test("POST -> 'BASE_URL', should return status 201, res.body to be defined and res.body.name === product.name", async () => {
    console.log("CREATE PRODUCT")
    const response = await request(app)
                            .post(BASE_URL)
                            .send(product)
                            .set('Authorization', `Bearer ${TOKEN}`);
    productId = response.body.id;
    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.name).toBe(product.name);
});

test("GET -> 'BASE_URL', should return status 200 and res.body to be defined and res.body to have length === 1", async () => {
    console.log("GET ALL PRODUCTS")
    const response = await request(app)
                            .get(BASE_URL);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveLength(1);
    // expect the Category relations to Product
    expect(response.body[0].category).toBeDefined();
    expect(response.body[0].category.id).toBe(category.id);
});

test("GET -> 'BASE_URL?category=CATEGORY-ID', should return status 200 and res.body to be defined and res.body.length === 1, res.body[0].categoryId === category.id and res.body[0].category.id === category.id", async () => {
    console.log("GET ALL PRODUCTS WITH CATEGORY FILTERED BY QUERY")
    const response = await request(app) 
                            .get(`${BASE_URL}?category=${categoryId}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveLength(1);
    expect(response.body[0].categoryId).toBe(category.id);
    expect(response.body[0].category.id).toBe(category.id);
});  