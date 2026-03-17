import 'dotenv/config'
import * as UserService from '../services/user/UserService.js'


export const search = async (req, res) => {
    try {

        let { limit = 12, page = 1,fields } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);
        if (isNaN(limit) || isNaN(page))
            return res.status(400).json({ message: "limit and page must be numbers" })
        
        

        const { status, body } = await UserService.search({limit,page,fields});
      return res.status(status).json(body)
    } catch (error) {
        console.error(error); // Log para debug
        return res.status(500).json({ message: 'There was an error try again' })
    }
}
export const getById = async (req, res) => {
    try {

        const { id } = req.params;
        const {status,body} = await UserService.getById(id)
        return res.status(status).json(body)
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
       if (!firstname || !surname || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }
        const { status, body } = await UserService.create({
            firstname, surname, email, password, confirmpassword
        })
        return res.status(status).json(body)
    } catch (error) {
        return res.status(500).json({
            message: `Error creating user: ${error.message}`
        })
    }
}
export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const {status,body} = await UserService.update(id,req.body)
    if (status === 204) {
                return res.status(204).send();
            }

            return res.status(status).json(body);

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}
export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const {status,body} = await UserService.remove(id)
        if(status===204){ return res.status(204).send()}
        
        
        return res.status(status).json(body)
    } catch (error) {
        return res.status(500).json({
            message: `Internal server error`
        })
    }
}

export const login = async (req, res) => {
    try {
        console.log("BODY RECEBIDO NO CONTROLLER:", req.body); // Verifique se o body não está vazio
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            })
        }
        const {status,body} = await UserService.login({email, password})
        return res.status(status).json(body)

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })

    }
}