require('../models')
const request = require("supertest")
const app = require("../app")
const Product = require("../models/Product")
const Cart = require("../models/Cart")

const USER_URL = '/users/login'
const BASE_URL = '/cart'
let TOKEN
let bodyCart
let bodyProduct
let product
let userId
let cartId


beforeAll(async () => {
  const user = {
    email: "juan@gmail.com",
    password: "juan1234"
  }

  const response = await request(app)
    .post(USER_URL)
    .send(user)

  TOKEN = response.body.token
  userId = response.body.user.id

  bodyProduct = {
    title: 'Playera',
    description: 'lorem21',
    price: 45.45,
  }

  product = await Product.create(bodyProduct)

  bodyCart = {
    quantity: 1,
    productId: product.id
  }

  Cart.create({ quantity: 1 })

})

test("POST -> 'BASE_URL', should return status code 201, res.body to be de defined and res.body.quantity === bodyCart.quantity", async () => {
  const response = await request(app)
    .post(BASE_URL)
    .send(bodyCart)
    .set('Authorization', `Bearer ${TOKEN}`)

  cartId = response.body.id
  expect(response.status).toBe(201)
  expect(response.body).toBeDefined()
  expect(response.body.quantity).toBe(bodyCart.quantity)
  expect(response.body.userId).toBe(userId)
})

test("GET -> 'URL_BASE', should status 200, res.body to be defined and res.body.length === 1", async () => {
  const response = await request(app)
    .get(BASE_URL)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(response.status).toBe(200)
  expect(response.body).toBeDefined()
  expect(response.body).toHaveLength(1)

  expect(response.body[0].userId).toBeDefined()
  expect(response.body[0].userId).toBe(userId)

  expect(response.body[0].productId).toBeDefined()
  expect(response.body[0].productId).toBe(product.id)


})


test("GET -> 'URL_BASE/:id', should status 200, res.body to be defined and res.body.quantity === bodyCart.quantity", async () => {
  const response = await request(app)
    .get(`${BASE_URL}/${cartId}`)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(response.status).toBe(200)
  expect(response.body).toBeDefined()
  expect(response.body.quantity).toBe(bodyCart.quantity)

  expect(response.body.userId).toBeDefined()
  expect(response.body.userId).toBe(userId)

  expect(response.body.productId).toBeDefined()
  expect(response.body.productId).toBe(product.id)
})

test("PUT -> 'URL_BASE/:id' should return status code 200, res.body to be defined, and res.body.quantity to Be 3", async () => {

  const response = await request(app)
    .put(`${BASE_URL}/${cartId}`)
    .set('Authorization', `Bearer ${TOKEN}`)
    .send({ quantity: 3 })

  expect(response.status).toBe(200)
  expect(response.body).toBeDefined()
  expect(response.body.quantity).toBe(3)
})

test("DELETE -> 'URL_BASE/:id' should return status code 204", async () => {
  const response = await request(app)
    .delete(`${BASE_URL}/${cartId}`)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(response.status).toBe(204)
  await product.destroy()
})