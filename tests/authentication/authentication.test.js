
import User from '../../src/models/User.js'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import {getAuthToken, setupTestUser} from '../setup.js'
import app from '../../src/app.js'
let authToken
let testUser

beforeAll(async()=>{
     testUser = await setupTestUser();
})


test('Should return success',async()=>{
    const res = await request(app).post('/v1/user/token').send({
        email:testUser.email,
        password:testUser.password
    })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
})

test('Should fail with a non existing email',async()=>{
    const res = await request(app).post('/v1/user/token').send({
        email:'naoexiste@gmail.com',
        password:'123456766'
    })
    expect(res.status).toBe(401)
    expect(res.body.message).toContain('Invalid')
})
test('Should fail with a incorrect password',async()=>{
    const res = await request(app).post('/v1/user/token').send({
        email:testUser.email,
        password:'123456766'
    })
    expect(res.status).toBe(401)
        expect(res.body.message).toContain('Invalid credentials')

})
test('Should fail without email and password',async()=>{
    const res = await request(app).post('/v1/user/token').send({})
    expect(res.status).toBe(400)
    expect(res.body.message).toContain('Email')
})
test('Should fail with an invalid email format',async()=>{
    const res = await request(app).post('/v1/user/token').send({
        email:'invalidemail',
        password:'123456766'
    })
    expect(res.status).toBe(400)
    expect(res.body.message).toContain('email format')
})