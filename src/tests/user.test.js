const request = require('supertest');
const app = require('../app');

const BASE_URL = '/users';
let TOKEN = '';
let userId;

const user = {
    firstName: "Juan",
    lastName: "Perez",
    email: "juan@gmail.com",
    password: "juan1234",
    phone: "1234567890"
};

beforeAll(async () => {
    const userLogin = { email: "dergisamlop@gmail.com", password: "dergi1234" };
    const response = await request(app)
                            .post(`${BASE_URL}/login`)
                            .send(userLogin);
    TOKEN = response.body.token;
});

test("GET 'BASE_URL', should return status code 200 and res.body to be an array length = 1", async () => {
    const response = await request(app)
                            .get(BASE_URL)
                            .set('Authorization', `Bearer ${TOKEN}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
});

test("POST 'BASE_URL', should return status code 201, res.body to be defined and res.body.firstName === user.firstName", async () => {
    const response = await request(app)
                            .post(BASE_URL)
                            .send(user);
    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.firstName).toBe(user.firstName);
    userId = response.body.id;
});

test("PUT 'BASE_URL/:id', should return status code 200, res.body to be defined and res.body.firstName === 'Pedro'", async () => {
    const response = await request(app)
                            .put(`${BASE_URL}/${userId}`)
                            .send({ firstName: "Pedro" })
    .set("Authorization", `Bearer ${TOKEN}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.firstName).toBe("Pedro");
});

test("POST 'BASE_URL/login', should return status code 200, res.body to be defined and res.body.user.email === user.email, and res.body.token to be defined", async () => {
    const userLogin = { email: "dergisamlop@gmail.com", password: "dergi1234" };
    const response = await request(app)
                            .post(`${BASE_URL}/login`)
                            .send(userLogin);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.user.email).toBe(userLogin.email);
    expect(response.body.token).toBeDefined();
});

test("POST 'BASE_URL/login', should return status code 401", async () => {
    const userLogin = { email: "dergisamlop@gmail.com", password: "No Password" };
    const response = await request(app)
                            .post(`${BASE_URL}/login`)
                            .send(userLogin);
    expect(response.status).toBe(401);
});

test("DELETE 'BASE_URL/:id', should return status code 204, res.body to be defined and res.body.firstName === 'Pedro'", async () => {
    const response = await request(app)
                            .delete(`${BASE_URL}/${userId}`)
                            .set('Authorization', `Bearer ${TOKEN}`);
    expect(response.status).toBe(204);
});