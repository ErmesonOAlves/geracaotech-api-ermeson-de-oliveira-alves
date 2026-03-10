import request from 'supertest'
import app from '../../src/app.js'
import {faker} from '@faker-js/faker'
import User from '../../src/models/User.js'
let authToken
const authenticatedRequest = (method, url) => {
    return request(app)[method](url).set('Authorization', `Bearer ${authToken}`);
};
beforeAll(async () => {
    await User.destroy({ where: {}, truncate: true });
    await request(app).post('/v1/user').send({
        firstname:'Testes',
        surname:'Testes',
        email:'ghost212@gmail.com',
        password:'12345678',
        confirmpassword:'12345678'
    })
    const loginRes = await request(app).post('/v1/user/token').send({email:'ghost212@gmail.com',password:'12345678'})
    authToken = loginRes.body.token;
});

test('Should create a user',async ()=>{
    const randomUser = {
        firstname:faker.person.firstName(),
        surname:faker.person.lastName(),
        email:faker.internet.email(),
        password:'123456789',
        confirmpassword:'123456789'
    }
    const res = await request(app).post('/v1/user').send(randomUser)
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true)
})
test('Should fail when creating a user with a insecure password',async ()=>{
    const randomUser = {
        firstname:faker.person.firstName(),
        surname:faker.person.lastName(),
        email:faker.internet.email(),
        password:'12',
        confirmpassword:'12'
    }
    const res = await request(app).post('/v1/user').send(randomUser)
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Invalid password')
})
test('Should fail when passwords dont match',async ()=>{
    const randomUser = {
        firstname:faker.person.firstName(),
        surname:faker.person.lastName(),
        email:faker.internet.email(),
        password:'12',
        confirmpassword:'21'
    }
    const res = await request(app).post('/v1/user').send(randomUser)
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('do not match')
})
test('Should fail when creating a user without password',async ()=>{
    const randomUser = {
        firstname:faker.person.firstName(),
        surname:faker.person.lastName(),
        email:faker.internet.email(),
        
    }
    const res = await request(app).post('/v1/user').send(randomUser)
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('required')
})
test('List all users',async ()=>{
    const res = await request(app).get('/v1/user/search');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data')
})
test('Listing a user by a existing ID',async ()=>{
    const id = 1;
    const res = await authenticatedRequest('get',`/v1/user/${id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('firstname');
    expect(res.body).toHaveProperty('surname');
    expect(res.body).toHaveProperty('email');
    expect(res.body).not.toHaveProperty('password');

})

test('Listing a user with a non existing ID',async ()=>{
    const id = 909;
    const res = await authenticatedRequest('get',`/v1/user/${id}`)
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toContain('not found')
})

test('Should fail when creating user with existing email',async ()=>{
    const res = await request(app).post('/v1/user').send({
        firstname:'Garapaxxxxasdasd',
        surname:'Da silvaxxxa',
        email:'ghost212@gmail.com',
        password:'123456789',
        confirmpassword:'123456789'
    })
    expect(res.status).toBe(409);
    
})