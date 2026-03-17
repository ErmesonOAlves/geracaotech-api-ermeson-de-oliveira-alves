import 'dotenv/config'
import jwt from 'jsonwebtoken'
import User from '../../models/User.js'
import validator from 'validator'
import { hashPassword, verifyPassword } from '../../config/password.js'
export const search = async({limit,page,fields})=>{

    const options = {
            attributes: ['id','firstname', 'surname', 'email'],
            order: [['id', 'ASC']]
        };
    if (fields) options.attributes = fields.split(',')
    if (limit !== -1) {
        options.limit = limit;
        options.offset = (page - 1) * limit;
    }
    const {count,rows} = await User.findAndCountAll(options)
    return { status: 200, body: { data: rows, total: count, limit, page } }
}
export const create = async({ firstname, surname, email, password, confirmpassword } )=>{
     if (email) {
            if (!validator.isEmail(email)) {
                return{
                    status:400,
                    body: {message: 'invalid email format'}
                }
            }
        }
        if (!firstname || !surname || firstname.trim().length < 2 || surname.trim().length < 2) {
                return { 
                    status: 400, 
                    body: { message: "First name and surname must be at least 2 characters" } 
                };
            }
       
        const existingUser = await User.findOne({ where: { email: email.toLowerCase().trim() } })
        if (existingUser) {
            return{
                status:409,
                body: {message: 'Email already exists'}
            }}
        if (!password || password.length < 8 || password !== confirmpassword) {
            return{
                status:400,
                body: {message:"Invalid password or passwords do not match"}
            }
        }

        const hashedPassword = await hashPassword(password)
        const user = await User.create({
            firstname: firstname.trim(),
            surname: surname.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword
        })
        return { status: 201, body: { id: user.id, firstname: user.firstname, surname: user.surname, email: user.email } }
}
export const getById = async(id)=>{
    const numId = Number(id)
    if (!Number.isInteger(numId) || numId <= 0 || !Number.isFinite(numId))
        return { status: 400, body: { message: 'Invalid ID' } }
    if (numId > 2147483647)
        return { status: 404, body: { message: 'User not found' } }

    const user = await User.findByPk(id,{
        attributes:{exclude:['createdAt', 'updatedAt', 'created_at', 'updated_at', 'password']}
    }
    );
    if (!user) return { status: 404, body: { message: "User not found" } }
    return { status: 200, body: user }
}
export const update = async(id,{ firstname, surname, email })=>{
     const numId = Number(id);

    // 1. Validação de ID
    if (!Number.isInteger(numId) || numId <= 0) {
        return { status: 400, body: { message: "Invalid ID" } };
    }

    // 2. Verifica se ao menos um campo foi enviado
    if (!firstname && !surname && !email) {
        return { status: 400, body: { message: "At least one field must be provided" } };
    }

    // 3. Validações de tamanho de nome
    if (firstname && firstname.trim().length < 2) {
        return { status: 400, body: { message: "First name must be at least 2 characters" } };
    }
    if (surname && surname.trim().length < 2) {
        return { status: 400, body: { message: "Surname must be at least 2 characters" } };
    }

    // 4. Validação de E-mail e Unicidade
    if (email) {
        if (!validator.isEmail(email)) {
            return { status: 400, body: { message: 'invalid email format' } };
        }

        const existingUser = await User.findOne({ where: { email: email.toLowerCase().trim() } });
        // Verifica se o email já existe em outro usuário (ID diferente)
        if (existingUser && existingUser.id !== numId) {
            return { status: 409, body: { message: "Email already exists" } };
        }
    }

    // 5. Preparação dos dados para o banco
    const updateData = {};
    if (firstname) updateData.firstname = firstname.trim();
    if (surname) updateData.surname = surname.trim();
    if (email) updateData.email = email.toLowerCase().trim();

    // 6. Execução do Update no Banco
    const [rowsUpdated] = await User.update(updateData, { where: { id: numId } });

    if (!rowsUpdated) {
        return { status: 404, body: { message: `User with id ${id} not found` } };
    }

    // Retorno de sucesso (204 No Content é padrão para updates bem-sucedidos sem retorno de objeto)
    return { status: 204, body: null };
}
export const remove = async(id)=>{
    const numId = Number(id);

    // 1. Validação de ID (mesma lógica do getById)
    if (!Number.isInteger(numId) || numId <= 0) {
        return { status: 400, body: { message: "Invalid ID" } };
    }

    // 2. Executa a remoção
    const deleted = await User.destroy({
        where: { id: numId }
    });

    // 3. Verifica se algo foi realmente apagado
    if (!deleted) {
        return { 
            status: 404, 
            body: { message: `User with id ${id} not found` } 
        };
    }

    // Sucesso na remoção
    return { status: 204, body: null };

}



export const login = async({email,password})=>{

    if(!email){
        return{
            
            status:400,
            body:{message:"Email is required"}
        }
    }
    if (email) {
            if (!validator.isEmail(email)) {
                return{
                    status:400,
                    body: {message: 'invalid email format'}
                }
            }
        }
    const cleanedEmail = email.toLowerCase().trim();
    const user = await User.findOne({
        where:{email: cleanedEmail},
        attributes: ['id','email','password']
    })
    if(!user){
        return{
            status:401,
            body:{message: "Invalid credentials"}
        }
    }

    const isAValidPassword = await verifyPassword(password, user.password)
    if(!isAValidPassword){
        return{
            status: 401,
            body:{message: "Invalid credentials"}
        }
    }
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({id:user.id,email:user.email},secret,{expiresIn:"15m"})
    return{status:200,body:{token}}
}