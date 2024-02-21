const request = require('supertest');
const app = require('../app');
const { default: test } = require('node:test');

const URL_BASE = '/users';
let TOKEN = '';
// let HEADER = { Authorization: `Bearer ${TOKEN}` };

const user = {
    firstName: "Juan",
    lastName: "Perez",
    email: "juan@gmail.com",
    password: "juan1234",
    phone: "1234567890",
};

beforeAll(async () => {
    const user = { email: "dergisamlop@gmail.com", password: "dergi1234" };
    const response = await request(app).post(`${BASE_URL}/login`).send(user);
    TOKEN = response.body.token;
});

test("GET 'BASE_URL', should return status code 200 and res.body to be an array length = 1", async () => {
    const response = (await request(app).get(URL_BASE)).set('Authorization', `Bearer ${TOKEN}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
});

test("POST 'BASE_URL', should return status code 201, res.body to be defined and res.body.firstName === user.firstName", async () => {
    const response = await request(app).post(URL_BASE).send(user);
    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.firstName).toBe(user.firstName);
});