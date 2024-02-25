const req = require('supertest');
const app = require('../app');

const BASE_URL = '/products';
let product;
let TOKEN;
let productId;
let categoryId;

beforeAll(async () => {
    const user = {
        email: "juan@gmail.com",
        password: "juan1234"
    };
    const response = await req(app)
                            .post('/users/login')
                            .send(user);
    TOKEN = response.body.token;

    const responseCategory = await req(app)
                                    .post('/categories')
                                    .send({ name: 'Electrodomésticos' })
                                    .set('Authorization', `Bearer ${TOKEN}`);
    categoryId = responseCategory.body.id;

    product = {
        title: 'Horno microondas',
        description: 'Horno microondas de acero inoxidable',
        price: 100.99,
        categoryId: categoryId
    };
});

afterAll(async () => {
    await req(app)
            .delete(`${BASE_URL}/${productId}`)
            .set('Authorization', `Bearer ${TOKEN}`);
    await req(app)
            .delete(`/categories/${categoryId}`)
            .set('Authorization', `Bearer ${TOKEN}`);
});

test("POST -> 'BASE_URL', should return status 201, res.body to be defined and res.body.name === product.name", async () => {
    console.log(product)
    const response = await req(app)
                            .post(BASE_URL)
                            .send(product)
                            .set('Authorization', `Bearer ${TOKEN}`);
    productId = response.body.id;
    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.name).toBe(product.name);
});