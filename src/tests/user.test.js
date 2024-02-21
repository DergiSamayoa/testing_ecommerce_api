const request = require('supertest');
const app = require('../app');

const URL_BASE = '/users';

const user = {
    firstName: "Dergi",
    lastName: "Samlop",
    email: "dergisamlop@gmail.com",
    password: "dergi1234",
    phone: "1234567890",
};

test("POST /users, should return status code 201, res.body to be defined and re.body.firstName === user.firstName", async () => {
    const response = await request(app).post(URL_BASE).send(user);
    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.firstName).toBe(user.firstName);
});