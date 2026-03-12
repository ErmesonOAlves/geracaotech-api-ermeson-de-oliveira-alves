import request from 'supertest'
import app from '../../src/app.js'
import Product from '../../src/models/Product.js'
import { getAuthToken, setupTestUser, baseProduct } from '../setup.js'
import { Op } from 'sequelize'
let authToken
let createdProductId;
const authenticatedRequest = (method, url) => {
    return request(app)[method](url).set('Authorization', `Bearer ${authToken}`);
};
beforeAll(async () => {
    await Product.destroy({
        where: {
            [Op.or]: [
                { name: { [Op.like]: '%teste%' } },
                { description: { [Op.like]: '%teste%' } }
            ]
        }
    })
    const testUser = await setupTestUser();
    authToken = await getAuthToken(testUser.email, testUser.password)


    const res = await authenticatedRequest('post', '/v1/product').send(baseProduct)
    createdProductId = res.body.id;
})

test('Should list all products', async () => {
    const res = await authenticatedRequest('get', '/v1/product/search');
    expect(res.status).toBe(200)
})
test('Should list a product by ID', async () => {
    const product = await authenticatedRequest('get', `/v1/product/${createdProductId}`)
    expect(product.status).toBe(200)
})
test('Should fail when listing a product by a non-existent ID', async () => {
    const notExists = createdProductId * 2 + 1;
    const product = await authenticatedRequest('get', `/v1/product/${notExists}`)
    expect(product.status).toBe(404)
    expect(product.body.message).toContain('not found')
})
test('Shoul fail when listing a product by an invalid ID', async () => {
    const product = await authenticatedRequest('get', `/v1/product/invalid-id`)
    expect(product.status).toBe(400)
    expect(product.body.message).toContain('Invalid ID')
})
test('Should successfully update a product', async () => {
    const updatedProduct = {
        name: 'Produto teste atualizado',
        slug: 'produto-teste-atualizado',
        price: 4000.00,
        price_with_discount: 3800.00
    }
    console.log(`O ID ${updatedProduct}`)
    const res = await authenticatedRequest('put', `/v1/product/${createdProductId}`).send(updatedProduct)

    expect(res.status).toBe(204)
})

test('Should fail when updating a non-existent product', async () => {
    const notExists = createdProductId + 9939393939
    const updatedProduct = {
        name: 'Produto teste atualizado',
        slug: 'produto-teste-atualizado',
        price: 4000.00,
        price_with_discount: 3800.00
    }
    const res = await authenticatedRequest('put', `/v1/product/${notExists}`).send(updatedProduct)
    expect(res.status).toBe(404)
    expect(res.body.message).toContain('not found')
})
test('Should fail when updating a product without required fields', async () => {
    const invalidProduct = {
        name: 'Produto teste',
        slug: 'produto-teste',
        price: 4000.00
    }
    const res = await authenticatedRequest('put', `/v1/product/${createdProductId}`).send(invalidProduct)
    expect(res.status).toBe(400)
    expect(res.body.message).toContain('fields are required')
})
test('Should delete a product', async () => {
    const res = await authenticatedRequest('delete', `/v1/product/${createdProductId}`)
    expect(res.status).toBe(204)
})
test('Should fail when trying to delete a non-existent product', async () => {
    const notExists = createdProductId * 909
    const res = await authenticatedRequest('delete', `/v1/product/${notExists}`)
    expect(res.status).toBe(404)
    expect(res.body.message).toContain('not found')
})


