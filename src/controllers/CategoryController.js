import * as CategoryService from '../services/category/CategoryService.js'

export const search = async (req, res) => {
  try {
    let { limit = 12, page = 1, fields, use_in_menu } = req.query
        limit = parseInt(limit)
        page = parseInt(page)
        if (isNaN(limit) || isNaN(page))
            return res.status(400).json({ message: "limit and page must be numbers" })

        const { status, body } = await CategoryService.search({ limit, page, fields, use_in_menu })
        return res.status(status).json(body)
  } catch (error) {
    return res.status(500).json({ message: `server internal error` })
  }
}
export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const {status,body} = await CategoryService.getById(id)
    return res.status(status).json(body)
   
  } catch (error) {
    return res.status(500).json({
      message: `server internal error`
    })
  }
}

export const create = async (req, res) => {
  try {
        const { name, slug, use_in_menu } = req.body
        if (!name || !slug)
            return res.status(400).json({ message: "name and slug are required" })

        const { status, body } = await CategoryService.create({ name, slug, use_in_menu })
        return res.status(status).json(body)
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, use_in_menu } = req.body;
    if(!name || !slug) return res.status(404).json({message:"name and slug are required"})
    
    const { status, body } = await CategoryService.update(id, { name, slug, use_in_menu })
        return res.status(status).json(body)
  } catch (error) {
    return res.status(500).json({
      message: `Update failed, verify the error message`,
      error: error.message
    })
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
    const { status, body } = await CategoryService.remove(id)
    return res.status(status).json(body)
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    })
  }
}