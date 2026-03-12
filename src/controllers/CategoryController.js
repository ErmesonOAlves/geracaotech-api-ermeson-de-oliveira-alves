import Category from '../models/Category.js'
import {Op} from 'sequelize'
export const search = async (req, res) => {
  try {

    let { limit = 12, page = 1, fields, use_in_menu } = req.query

    limit = parseInt(limit)
    page = parseInt(page)

    if (isNaN(limit) || isNaN(page)) {
      return res.status(400).json({
        message: "limit e page must be numbers"
      })
    }

 const options = {
            attributes:['id','name','slug','use_in_menu'],
            order:[['id','ASC']]
        };
    if (fields) {
      options.attributes = fields.split(',')
    }

    if (use_in_menu !== undefined) {
      options.where = {
        use_in_menu: use_in_menu === 'true'
      }
    }

    if (limit !== -1) {
      options.limit = limit
      options.offset = (page - 1) * limit
    }

    const { count, rows } = await Category.findAndCountAll(options)

    return res.status(200).json({
      data: rows,
      total: count,
      limit: limit,
      page: page
    })

  } catch (error) {

    return res.status(500).json({
      message: "Internal server error"
    })

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
    const category = await Category.findByPk(id, {
      attributes: ['id', 'name', 'slug', 'use_in_menu']
    })
    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      })
    }
    return res.status(200).json(category)
  } catch (error) {
    return res.status(500).json({
      message:`server internal error`
    })
  }
}

export const create = async (req, res) => {
  try {
    const { name, slug, use_in_menu } = req.body;
    if (!name || !slug) {
      return res.status(400).json({
        message: "name and slug are required"
      })
    }
    if (name.trim().length < 2 || slug.trim().length < 2) {
                return res.status(400).json({
                    message: "name and slug must be at least 2 characters"
                })
            }
            const existingCategory = await Category.findOne({
              where:{[Op.or]:[{name},{slug}]}
            })
            if (existingCategory) {
                return res.status(409).json({
                    message: "Category name or slug already exists"
                })
            }

    const category = await Category.create({
      name:name.trim(),
      slug:slug.trim(),
      use_in_menu
    })

    return res.status(201).json(category)

  } catch (error) {
    return res.status(400).json({
      message: "Internal server error"
    })
  }
}

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, use_in_menu } = req.body;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        message: "category not found"
      })
    }
    await category.update({ name, slug, use_in_menu })
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({
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
    const deleted = await Category.destroy({
      where: { id: id }
    })
    if (!deleted) {
      return res.status(404).json({
        message: `Category not found`
      })
    }
    return res.status(204).send()
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    })
  }
}