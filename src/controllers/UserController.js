import 'dotenv/config'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { hashPassword, verifyPassword } from '../config/password.js'
import validator from 'validator'
export const search = async(req,res)=>{
    try {
        
        let { limit = 12, page = 1 } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);
        const options = {
            attributes:['firstname','surname','email'],
            order:[['id','ASC']]
        };
        if (limit !== -1) {
            options.limit = limit;
            options.offset = (page - 1) * limit;
        }
        
        const { count, rows } = await User.findAndCountAll(options);
        return res.status(200).json({
            data:rows,
            total:count,
            limit:limit,
            page:page
        })
    } catch (error) {
        return res.status(500).json({message:'There was an error try again'})
    }
}
export const getById = async (req, res) => {
    try {

        const { id } = req.params;
        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({
                message: "Invalid ID"
            })
        }
        const user = await User.findByPk(id, {
            attributes: ['id', 'firstname', 'surname', 'email']
        })
        if (!user) {
            return res.status(404).json({
                message: `User with id ${id}not found`
            })
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({
            message:
                error.message
        })
    }
}
export const create = async (req, res) => {
    try {
        const { firstname, surname, email, password, confirmpassword } = req.body
        if(email){
            if(!validator.isEmail(email)){
                return res.status(400).json({
                    message:'invalid email format'})
            }
        }

        if (!firstname || !surname || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }
        if (firstname.trim().length < 2 || surname.trim().length < 2) {
            return res.status(400).json({
                message: "First name and surname must be at least 2 characters"
            })
        }
        const existingUser = await User.findOne({ where: { email } })
        if (existingUser) {
            return res.status(409).json({
                message: "Email already in use"
            })
        }
        if (!password || password.length < 8 || password !== confirmpassword) {
            return res.status(400).json({
                message: "Invalid password or passwords do not match"
            });
        }

        const hashedPassword = await hashPassword(password)
        const user = await User.create({
            firstname:firstname.trim(),
            surname:surname.trim(),
            email:email.toLowerCase().trim(),
            password: hashedPassword
        })
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                firstname: user.firstname,
                surname: user.surname,
                email: user.email
            }
        })
    } catch (error) {
        return res.status(400).json({
            message: `Error creating user: ${error.message}`
        })}
    }
export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstname, surname, email } = req.body

        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({
                message: "Invalid ID"
            })
        }

        if (!firstname && !surname && !email) {
            return res.status(400).json({
                message: "At least one field must be provided"
            })
        }

        if (firstname && firstname.trim().length < 2) {
            return res.status(400).json({
                message: "First name must be at least 2 characters"
            })
        }

        if (surname && surname.trim().length < 2) {
            return res.status(400).json({
                message: "Surname must be at least 2 characters"
            })
        }

        if (email) {
            if(!validator.isEmail(email)){
                return res.status(400).json({
                    message:'invalid email format'
                })
            }
            }

            const existingUser = await User.findOne({ where: { email } })
            if (existingUser && existingUser.id !== Number(id)) {
                return res.status(409).json({
                    message: "Email already exists"
                })
            }
        

        const updateData = {}
        if (firstname) updateData.firstname = firstname.trim()
        if (surname) updateData.surname = surname.trim()
        if (email) updateData.email = email.toLowerCase().trim()

        const [rowsUpdated] = await User.update(updateData, { where: { id } })

        if (!rowsUpdated) {
            return res.status(404).json({
                message: `User with id ${id} not found`
            })
        }

        return res.status(204).send()

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}
export const remove = async (req, res) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id))||Number(id)<=0) {
            return res.status(400).json({
                message: "Invalid ID"
            })
        }

        const deleted = await User.destroy({
            where: { id: id }
        })
        if (!deleted) {
            return res.status(404).json({
                message: `User with id ${id} not found`
            })
        }

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({
            message: `Internal server error`
        })
    }
}

export const login = async(req,res)=>{
    try {
        const {email,password} = req.body
        if(email){
            if(!validator.isEmail(email)){
                return res.status(400).json({
                    message:'invalid email format'
                })
            }
        }
        if(!email||!password){
            return res.status(400).json({
                message:"Email and password are required"
            })
        }
        const user = await User.findOne({
            where:
                {email:email.toLowerCase().trim()},
                 attributes: ['id', 'email', 'password']
        })
        if(!user){
            return res.status(401).json({
                message:"Invalid credentials"
            })
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("ERRO CRÍTICO: JWT_SECRET não definido no arquivo .env");
            return res.status(500).json({ 
                message: "Internal server error" 
            });
        }
        const isPasswordValid = await verifyPassword(password, user.password)
        if(!isPasswordValid){
            return res.status(401).json({
                message:"Invalid credentials"
            })
        }
        const token = jwt.sign(
            {id:user.id,email:user.email},
            secret,
            {expiresIn:"15m"}
        )
        return res.status(200).json({
            token
        })


    } catch (error) {
        return res.status(500).json({
            message:"Internal server error",
            error:error.message
        })
        
    }
}