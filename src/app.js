import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import UsersRoutes from './routes/UsersRoutes.js'
import CategoryRoutes from './routes/CategoryRoutes.js'
import ProductRoutes from './routes/ProductRoutes.js'

if (!process.env.JWT_SECRET) {
    console.error('❌ ERRO CRÍTICO: A variável de ambiente JWT_SECRET não foi definida.')
    console.error('O servidor será encerrado por medidas de segurança.')
    process.exit(1)
}
const app = express()
app.use(cors())
app.use(express.json())
app.use(UsersRoutes)
app.use(CategoryRoutes)
app.use(ProductRoutes)
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Geração Tech E-commerce API',
            version: '1.0.0',
            description: 'API de gerenciamento de usuarios e produtos'
        },
        tags: [
            { name: 'Auth', description: 'Authentication endpoint' },
            { name: 'User', description: 'User endpoint' },
            { name: 'Category', description: 'Category endpoint' }
        ]

        , security: [
            {
                bearerAuth: [],
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                UserTokenRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', example: 'daleskaevila14@ggmail.com' },
                        password: { type: 'string', example: 'MAYHEMFAN236a<>' }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 12 },
                        firstname: { type: 'string', example: 'ermeson' },
                        surname: { type: 'string', example: 'ermesonusername' },
                        email: { type: 'string', example: 'teste@gmail.com' }
                    }
                },
                UserCreate: {
                    type: 'object',
                    required: ['firstname', 'surname', 'email', 'password'],
                    properties: {
                        firstname: { type: 'string', example: 'ermeson' },
                        surname: { type: 'string', example: 'ermesonusername' },
                        email: { type: 'string', example: 'teste@gmail.com' },
                        password: { type: 'string', example: '12345678' },
                        confirmpassword: { type: 'string', example: '12345678' }
                    }
                },
                UserUpdate: {
                    type: 'object',
                    properties: {
                        firstname: { type: 'string', example: 'Luan' },
                        surname: { type: 'string', example: 'Oliveira' },
                        email: { type: 'string', example: 'teste@gmail.com' }
                    }
                },
                Category: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 12 },
                        name: { type: 'string', example: 'nike' },
                        slug: { type: 'string', example: 'air-max' },
                        use_in_menu: { type: 'boolean', example: true },

                    }
                },
                CategoryCreate: {
                    type: 'object',
                    required: ['name', 'slug'],
                    properties: {
                        name: { type: 'string', example: 'nike' },
                        slug: { type: 'string', example: 'air-max' },
                        use_in_menu: { type: 'boolean', example: true },

                    }
                }, CategoryUpdate: {
                    type: 'object',
                    required: ['name', 'slug'],
                    properties: {
                        name: { type: 'string', example: 'nike' },
                        slug: { type: 'string', example: 'air-max' },
                        use_in_menu: {
                            type: 'boolean', example: true,
                            description: 'define if the category will be displayed in the menu'
                        },

                    }
                }, Product: {
                    type: 'object',
                    properties:{
                        id: { type: 'integer', example: 12 },
                        enabled: { type: 'boolean', example: true },
                        name: { type: 'string', example: 'nike' },
                        slug: { type: 'string', example: 'air-max' },
                        use_in_menu: { type: 'boolean', example: true },
                        stock: { type: 'integer', example: 12 },
                        description: { type: 'string', example: 'nike air max' },
                        price: { type: 'number', example: 12 },
                        price_with_discount: { type: 'number', example: 12 }
                    }
                },
                ProductCreate: {
                    type: 'object',
                    required: ['name', 'slug', 'price', 'price_with_discount'],
                    example:{
                        name:'nike',
                        slug:'air-max',
                        price:12,
                        price_with_discount:12,
                        category_ids:[1,2,3],
                        images:[{path:'/img1.png',enabled:true},{path:'/img2.png',enabled:true}],
                        options:[{title:'color',
                                shape:'circle',
                                radius:5,
                                type:'text',
                                values:['red','blue']}]
                    },
                    properties: {
                        name: { type: 'string' },
                        slug: { type: 'string' },
                        price: { type: 'number' },
                        price_with_discount: { type: 'number' },


                        category_ids: {
                            type: 'array',
                            items: { type: 'integer' },
                            description: 'Optional list of category ids'
                        },

                        images: {
                            type: 'array',
                            description: 'Optional list of product images',
                            items: {
                                type: 'object',
                                properties: {
                                    path: { type: 'string', example: '/img1.png' },
                                    enabled: { type: 'boolean', example: true }
                                }
                            }
                        },

                        options: {
                            type: 'array',
                            description: 'Optional product options',
                            items: {
                                type: 'object',
                                required: ['title', 'values'],
                                properties: {
                                    title: { type: 'string', example: 'color' },
                                    shape: { type: 'string', example: 'red' },
                                    radius: { type: 'number', example: 12 },
                                    type: { type: 'string', example: 'text' },
                                    values: {
                                        type: 'array',
                                        items: { type: 'string' },
                                        example: ['red', 'blue']
                                    }
                                }
                            }
                        }
                    }},
                ProductUpdate: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        slug: { type: 'string' },
                        enabled: { type: 'boolean' },
                        use_in_menu: { type: 'boolean' },
                        stock: { type: 'integer' },
                        description: { type: 'string' },
                        price: { type: 'number' },
                        price_with_discount: { type: 'number' },


                        category_ids: {
                            type: 'array',
                            items: { type: 'integer' },
                            description: 'Optional list of category IDs'
                        },

                        images: {
                            type: 'array',
                            description: 'Optional update of images',
                            items:{type:'object',
                                properties:{
                                    path:{type:'string',example:'/img1.png'},
                                    enabled:{type:'boolean',example:true}
                                }
                            }
                        },

                        options: {
                            type: 'array',
                            description: 'Optional update of options',
                            items:{
                                type:'object',
                                properties:{
                                    title: { type: 'string', example: 'color' },
                                    shape: { type: 'string', example: 'square or circle' },
                                    radius: { type: 'number', example: 12 },
                                    type: { type: 'string', example: 'text' },
                                    values: {
                                        type: 'array',
                                        items: { type: 'string' },
                                        example: ['red', 'blue']
                                    }
                                }
                            }
                        }
                    }
                }

            }
        },
    },
    apis: ['./src/routes/*.js', './src/docs/*.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
export default app