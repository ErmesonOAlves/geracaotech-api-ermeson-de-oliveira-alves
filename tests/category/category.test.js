import request from 'supertest'
import app from '../../src/app.js'
import Category from '../../src/models/Category.js'
import { Op } from 'sequelize'
import { getAuthToken, setupTestUser } from '../setup.js'
let authToken
let createdCategoryId
const authenticatedRequest = (method, url) => {
    return request(app)[method](url).set('Authorization', `Bearer ${authToken}`);
};

beforeAll(async () => {
    await Category.destroy({
        where: {
            [Op.or]: [
                { name: { [Op.like]: '%teste%' } },
                { slug: { [Op.like]: '%teste%' } }
            ]
        }
    });

    const testUser = await setupTestUser();
    authToken = await getAuthToken(testUser.email, testUser.password)


    const newCategory = {
        name: 'Categoria teste',
        slug: 'categoria-teste'
    }
    await authenticatedRequest('post', '/v1/category').send(newCategory)

    const categoryInDB = await Category.findOne({ where: { slug: newCategory.slug } })
    createdCategoryId = categoryInDB.id;

});
test('Should list all categories', async () => {
    const res = await request(app).get('/v1/category/search');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
})
test('Should list a category by ID', async () => {
    const res = await authenticatedRequest('get', `/v1/category/${createdCategoryId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('slug');
    expect(res.body).toHaveProperty('use_in_menu');
})
test('Should fail when listing a category by a non-existent ID', async () => {
    const notexists = createdCategoryId + 9939393939
    const res = await authenticatedRequest('get', `/v1/category/${notexists}`);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toContain('not found')
})
test('Should fail when listing a category by an invalid ID', async () => {
    const res = await authenticatedRequest('get', '/v1/category/not-valid-id');
    expect(res.status).toBe(400);
})
test('Should create a category', async () => {
    const newCategory = {
        name: 'Categoria teste 2',
        slug: 'categoria-teste-2'
    }
    const res = await authenticatedRequest('post', '/v1/category').send(newCategory);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('slug');
    expect(res.body).toHaveProperty('use_in_menu');
})
test('Should fail when creating a category without name and slug', async () => {
    const newCategory = {
        name: '',
        slug: '',
        use_in_menu: 0
    }
    const res = await authenticatedRequest('post', '/v1/category').send(newCategory);
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('required')
})
test('Should fail when creating a category with name and slug shorter than 2 chars', async () => {
    const newCategory = {
        name: 'a',
        slug: 'b',
        use_in_menu: 0
    }
    const res = await authenticatedRequest('post', '/v1/category').send(newCategory)
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('must be at least 2 characters')
})
test('Should successfully update a category', async () => {
    const res = await authenticatedRequest('put', `/v1/category/${createdCategoryId}`).send({ name: 'Categoria teste atualizada', slug: 'categoria-teste-atualizada' })
    expect(res.status).toBe(204)
})
test('Should fail when updating a non-existent category', async () => {
    const notexists = createdCategoryId + 9939393939
    const res = await authenticatedRequest('put', `/v1/category/${notexists}`).send({ name: 'teste', slug: 'teste' });
    expect(res.status).toBe(404)
    expect(res.body.message).toContain('not found')
})
test('Should fail when attempting to update a category with a name or slug shorter than 2 characters', async () => {
    const newCategory = {
        name: 'a',
        slug: 'bbbbbb'
    }
    const res = await authenticatedRequest('put', `/v1/category/${createdCategoryId}`).send(newCategory)
    expect(res.status).toBe(400)
    expect(res.body.message).toContain('validation failed')
})
test('Should delete a category', async () => {
    const res = await authenticatedRequest('delete', `/v1/category/${createdCategoryId}`)
    expect(res.status).toBe(204)
})
test('Should fail when trying to delete a non-existent category', async () => {
    const notExists = createdCategoryId + 909 * 222
    const res = await authenticatedRequest('delete', `/v1/category/${notExists}`)
    expect(res.status).toBe(404)
})

test('Should fail when creating a product without required fields', async () => {
    const newProduct = {
        "enabled": true,
        "name": "Notebook Gamer",
        "slug": "notebook-gamer",
        "stock": 10,
        "description": "Notebook para jogos",
        "price": 3500.00
    }
    const res = await authenticatedRequest('post', '/v1/product').send(newProduct);
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('fields are required')

})