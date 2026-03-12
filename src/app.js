import 'dotenv/config'
import express from 'express'
import UsersRoutes from './routes/UsersRoutes.js'
import CategoryRoutes from './routes/CategoryRoutes.js'
import ProductRoutes from './routes/ProductRoutes.js'

if (!process.env.JWT_SECRET) {
    console.error('❌ ERRO CRÍTICO: A variável de ambiente JWT_SECRET não foi definida.')
    console.error('O servidor será encerrado por medidas de segurança.')
    process.exit(1) // Encerra o processo do Node.js com erro
}
const app = express()
app.use(express.json())
app.use(UsersRoutes)
app.use(CategoryRoutes)
app.use(ProductRoutes)
export default app