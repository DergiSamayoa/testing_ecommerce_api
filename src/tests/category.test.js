const request = require('supertest');
const app = require('../app');

const BASE_URL = '/categories';
const category = { name: "ROPA DEPORTIVA" };
let TOKEN;

beforeAll(async () => {
    const user = {
        email: "juan@gmail.com",
        password: "juan1234"
    };
    const response = await request(app).post('/users/login').send(user);
    TOKEN = response.body.token;
});

test("POST -> 'BASE_URL',should return status 201, res.body to be defined and res.body.name === category.name", async () => {
    const response = await request(app)
                            .post(BASE_URL)
                            .send(category)
                            .set('Authorization', `Bearer ${TOKEN}`)
    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.name).toBe(category.name);
})