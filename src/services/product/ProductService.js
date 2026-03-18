import Product from '../../models/Product.js';
import { ProductImages, ProductOptions, Category } from '../../models/associations.js';
import sequelize from '../../config/connection.js'
import { Op } from 'sequelize';
export const search = async (query) => {
    let {
        limit = 12,
        page = 1,
        fields,
        match,
        category_ids,
        'price-range': priceRange,
        ...optionsFilters
    } = query;
    const where = {}
    const include = [
        { model: ProductImages, as: 'images', attributes: ['id', 'path'] },
        { model: ProductOptions, as: 'options', attributes: { exclude: ['createdAt', 'updatedAt', 'created_at', 'updated_at'] } },
        {
            model: Category,
            as: 'category',
            attributes: ['id'],
            through: { attributes: [] }
        }
    ];
    limit = parseInt(limit);
    page = parseInt(page);
    const queryOptions = {
        where,
        include,
        distinct: true,
        attributes: { exclude: ['createdAt', 'updatedAt', 'use_in_menu'] }
    };
    if (limit !== -1) {
        queryOptions.limit = limit;
        queryOptions.offset = (page - 1) * limit;
    }
    if (fields) {
        const fieldList = fields.split(',');
        queryOptions.attributes = fieldList.filter(f =>
            !['images', 'options', 'category'].includes(f)
        );
    }
    if (match) {
        where[Op.or] = [
            { name: { [Op.like]: `%${match}%` } },
            { description: { [Op.like]: `%${match}%` } }
        ];
    }

    if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        where.price = { [Op.between]: [min, max] };
    }

    if (category_ids) {
        const ids = category_ids.split(',');
        const catInclude = include.find(i => i.as === 'category');
        catInclude.where = { id: { [Op.in]: ids } };
    }

    Object.keys(optionsFilters).forEach(key => {
        if (key.startsWith('option[')) {
            const values = optionsFilters[key].split(',');
            const optInclude = include.find(i => i.as === 'options');
            optInclude.where = {
                [Op.or]: values.map(v => ({
                    values: { [Op.like]: `%${v}%` }
                }))
            };
        }
    });

    const { count, rows } = await Product.findAndCountAll(queryOptions);
    const formattedRows = rows.map(product => {
        const p = product.toJSON();
        const categoryIds = p.category ? p.category.map(c => c.id) : [];
        delete p.category;

        return {
            ...p,
            category_ids: categoryIds
        };
    });

    return {
        status: 200,
        body: {
            data: formattedRows,
            total: count,
            limit: limit,
            page: limit === -1 ? 1 : page
        }
    }
}
export const create = async (productData) => {
    const t = await sequelize.transaction();
    try {
        const { enabled, name, slug, stock, description, price, price_with_discount, category_ids, images, options } = productData;
        const product = await Product.create({
            enabled,
            name,
            slug,
            stock,
            description,
            price,
            price_with_discount
        }, { transaction: t });

        if (category_ids?.length > 0) {
            await product.setCategory(category_ids, { transaction: t })
        }
        if (images?.length > 0) {
            const imagesToCreate = images.map(img => ({
                product_id: product.id,
                enabled: true,
                path: img.path
            }));
            await ProductImages.bulkCreate(imagesToCreate, { transaction: t });
        }

        if (options?.length > 0) {
            const optionsToCreate = options.map(opt => {
                const radiusValue = typeof opt.radius === 'string'
                    ? parseInt(opt.radius.replace(/\D/g, ''))
                    : opt.radius;

                const rawValues = opt.values || opt.value;
                return {
                    product_id: product.id,
                    title: opt.title,
                    shape: opt.shape,
                    radius: radiusValue || 0,
                    type: opt.type,
                    values: Array.isArray(rawValues) ? rawValues.join(',') : rawValues
                };
            });
            await ProductOptions.bulkCreate(optionsToCreate, { transaction: t });
        }

        await t.commit();

        return {
            status: 201,
            body: {
                success: true,
                message: "Product created successfully",
                id: product.id
            }
        };

    } catch (error) {
        await t.rollback()
        return {
            status: 500,
            body: {
                message: "Failed to create product",
                error: error.message
            }
        }
    }

}
export const getById = async (id) => {
    const numId = Number(id);
    if (!Number.isInteger(numId) || numId <= 0 || !Number.isFinite(numId))
        return { status: 400, body: { message: 'Invalid ID' } }
    if (numId > 2147483647)
        return { status: 404, body: { message: 'Product not found' } }
    const product = await Product.findByPk(numId, {
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'use_in_menu']
        },
        include: [
            { model: ProductImages, as: 'images', attributes: ['id', 'path'] },
            { model: ProductOptions, as: 'options', attributes: { exclude: ['createdAt', 'updatedAt'] } },
            {
                model: Category,
                as: 'category',
                attributes: ['id'],
                through: { attributes: [] }
            }
        ]
    });
    if (!product) {
        return {
            status: 404,
            body: { message: "product not found" }
        }
    }
    const p = product.toJSON();
    const categoryIds = p.category ? p.category.map(c => c.id) : [];
    delete p.category;

    const formattedProduct = {
        id: p.id,
        enabled: p.enabled,
        name: p.name,
        slug: p.slug,
        stock: p.stock,
        description: p.description,
        price: p.price,
        price_with_discount: p.price_with_discount,
        category_ids: categoryIds,
        images: p.images,
        options: p.options
    };
    return { status: 200, body: formattedProduct }
}
export const update = async (id, productData) => {
    const t = await sequelize.transaction();
    try {
        const { enabled, name, slug, stock, description, price, price_with_discount, category_ids, images, options } = productData;
        const product = await Product.findByPk(id)
        if (!product) {
            await t.rollback();
            return { status: 404, body: { message: "Product not found" } }
        }

        await product.update({
            enabled,
            name,
            slug,
            stock,
            description,
            price,
            price_with_discount
        }, { transaction: t });

        if (category_ids) {
            await product.setCategory(category_ids, { transaction: t })
        }
        if (images?.length > 0) {
            for (const img of images) {
                if (img.id && img.deleted) {
                    await ProductImages.destroy({ where: { id: img.id }, transaction: t });
                } else if (!img.id) {
                    await ProductImages.create({
                        product_id: id,
                        enabled: true,
                        path: img.path
                    }, { transaction: t });
                }
            }
        }
        if (options?.length > 0) {
            for (const opt of options) {
                if (opt.id && opt.deleted) {
                    await ProductOptions.destroy({ where: { id: opt.id }, transaction: t });
                } else {
                    const radiusValue = typeof opt.radius === 'string'
                        ? parseInt(opt.radius.replace(/\D/g, ''))
                        : opt.radius;

                    const rawValues = opt.values || opt.value;
                    const optionData = {
                        title: opt.title,
                        shape: opt.shape,
                        radius: radiusValue || 0,
                        type: opt.type,
                        values: Array.isArray(rawValues) ? rawValues.join(',') : rawValues
                    };

                    if (opt.id) {
                        await ProductOptions.update(optionData, {
                            where: { id: opt.id },
                            transaction: t
                        });
                    } else {
                        await ProductOptions.create({
                            ...optionData,
                            product_id: id
                        }, { transaction: t });
                    }
                }
            }
        }
        await t.commit()
        return { status: 204 }



    } catch (error) {
        if (t) await t.rollback();
        throw error
    }
}
export const remove = async (id) => {
    const numId = Number(id);
    if (!Number.isInteger(numId) || numId <= 0) {
        return { status: 400, body: { message: "Invalid ID" } };
    }
    const t = await sequelize.transaction();
    try {

        const product = await Product.findByPk(id, { transaction: t });
        if (!product) {
            await t.rollback();
            return { status: 404, body: { message: "Product not found" } };
        }
        await product.setCategory([], { transaction: t });
        await ProductImages.destroy({ where: { product_id: id }, transaction: t });
        await ProductOptions.destroy({ where: { product_id: id }, transaction: t });
        await product.destroy({ transaction: t });

        await t.commit();
        return { status: 204 };
    } catch (error) {
        if (t) await t.rollback();
        return {
            status: 500,
            body: { message: 'An error occured, try again' }
        }
    }
}