import * as ProductService from '../services/product/ProductService.js';
import sequelize from '../config/connection.js';


export const create = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const {
            name, slug, price,
            price_with_discount
        } = req.body;
       if (!name || !slug || !price || price_with_discount === undefined) {
            return res.status(400).json({
                message: "All fields are required (name, slug, price, price_with_discount)"
            });
        }
        const {status,body} = await ProductService.create(req.body)
        return res.status(status).json(body)

        

    } catch (error) {
        await t.rollback();
        return res.status(400).json({
            message: "Failed to create product",
            error: error.message
        });
    }
};


export const search = async (req, res) => {
    try {
        const { status, body } = await ProductService.search(req.query)
        return res.status(status).json(body)
    } catch (error) {
        return res.status(400).json({
            message: "Search failed",
            error: error.message
        });
    }
};
export const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, body } = await ProductService.getById(id)
        return res.status(status).json(body)
    } catch (error) {
        return res.status(400).json({
            message: "Error retrieving product",
            
        });
    }
}


export const update = async (req, res) => {
   
    const { name, slug, price, price_with_discount } = req.body;
    
    if (!name || !slug || !price || price_with_discount === undefined) {
        return res.status(400).json({
            message: "All fields are required (name, slug, price, price_with_discount)"
        });
    }
     const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        
       
        const {status,body} = await ProductService.update(id, req.body)
        return res.status(status).json(body)
    } catch (error) {
        return res.status(400).json({ 
            message: "Update failed", 
            error: error.message 
        });
    }
}

export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        message: "Invalid ID"
      })
    }
    const { status, body } = await ProductService.remove(id)
    if (status === 204) {
            return res.status(204).send();
        }
    return res.status(status).json(body)
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      error:error.message
    })
  }
}