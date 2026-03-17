import Category from '../../models/Category.js'
import { Op } from 'sequelize'
export const search = async ({ limit, page, fields, use_in_menu }) => {
    const options = {
        attributes: ['id', 'name', 'slug', 'use_in_menu'],
        order: [['id', 'ASC']]
    }
    if (fields) options.attributes = fields.split(',')
    if (use_in_menu !== undefined) options.where = { use_in_menu: use_in_menu === 'true' }
    if (limit !== -1) { options.limit = limit; options.offset = (page - 1) * limit }

    const { count, rows } = await Category.findAndCountAll(options)
    return { status: 200, body: { data: rows, total: count, limit, page } }

}
export const create = async ({ name, slug, use_in_menu }) => {
     if (name.trim().length < 2 || slug.trim().length < 2)
        return { status: 400, body: { message: 'name and slug must be at least 2 characters' } }

    const existing = await Category.findOne({ where: { [Op.or]: [{ name }, { slug }] } })
    if (existing)
        return { status: 409, body: { message: 'Category name or slug already exists' } }

    const category = await Category.create({ name: name.trim(), slug: slug.trim(), use_in_menu })
    return { status: 201, body: category }
}
export const getById = async (id) => {
    
   const numId = Number(id)
    if (!Number.isInteger(numId) || numId <= 0 || !Number.isFinite(numId))
        return { status: 400, body: { message: 'Invalid ID' } }
    if (numId > 2147483647)
        return { status: 404, body: { message: 'Category not found' } }
    const category = await Category.findByPk(id, { attributes: ['id', 'name', 'slug', 'use_in_menu'] })
    if (!category) return { status: 404, body: { message: "Category not found" } }
    return { status: 200, body: category }
}

export const update = async (id, { name, slug, use_in_menu }) => {
    if (!name || name.trim().length < 2 || !slug || slug.trim().length < 2)
        return { status: 400, body: { message: 'validation failed: name and slug must be at least 2 characters' } }
    const category = await Category.findByPk(id)
    if (!category) return { status: 404, body: { message: 'Category not found' } }
    await category.update({ name, slug, use_in_menu })
    return { status: 204, body: null }
}

export const remove = async (id) => {
    const deleted = await Category.destroy({ where: { id } })
    if(!deleted) return { status: 404, body: { message: "Category not found" } }
    return { status: 204, body: null }
}