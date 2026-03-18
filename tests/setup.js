import request from 'supertest'
import app from '../src/app.js'
import User from '../src/models/User.js'

export const setupTestUser = async () => {
    const testUser = {
        email: 'test@test.com',
        password: '12345678'
    }
    
    const userExists = await User.findOne({ where: { email: testUser.email } })
    
    if (!userExists) {
        await request(app).post('/v1/user').send({
            firstname: 'Test',
            surname: 'User',
            email: testUser.email,
            password: testUser.password,
            confirmpassword: testUser.password
        })
    }
    
    return testUser
}

export const getAuthToken = async (email, password) => {
    const res = await request(app).post('/v1/user/token').send({ email, password })
    return res.body.token
}


export const baseProduct = {
    enabled: true,
    name: "Produto teste 01",
    slug: "produto-teste-01",
    stock: 10,
    description: "Descrição do produto teste 01",
    price: 119.90,
    price_with_discount: 99.90,
    category_ids: [4],
    images: [
        {
            type: "image/png",
            path: "base64 da imagem 1"
        },
        {
            type: "image/png",
            path: "base64 da imagem 2"
        },
        {
            type: "image/jpg",
            path: "base64 da imagem 3"
        }
    ],
    options: [
        {
            title: "Cor",
            shape: "square",
            radius: "4px",
            type: "text",
            values: ["PP", "GG", "M"]
        },
        {
            title: "Tamanho",
            shape: "circle",
            type: "color",
            values: ["#000", "#333"]
        }
    ]
}
