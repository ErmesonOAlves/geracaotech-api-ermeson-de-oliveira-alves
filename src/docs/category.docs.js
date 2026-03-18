/**
     * @swagger
     * /v1/category/search:
     *   get:
     *     summary: Search all categories
     *     tags: [Category]
     *     security: []
     *     parameters:
     *       - in: query
     *         name: limit
     *         required: false
     *         schema:
     *           type: integer
     *         description: limit of registers returned
     *       - in: query
     *         name: page
     *         required: false
     *         schema:
     *           type: integer
     *         description: search page
     *     responses:
     *       200:
     *         description: List of categories
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 total:
     *                   type: integer
     *                 categories:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Category'
     *       400:
     *         description: limit and page must be numbers
     *       500:
     *         description: Internal server error
     */
    
    /**
     * @swagger
     * /v1/category/{id}:
     *   get:
     *     summary: Search category by ID
     *     tags: [Category]
     *     security: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID category
     *     responses:
     *       200:
     *         description: Category found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Category'
     *       400:
     *         description: Invalid ID
     *       404:
     *         description: Category not found
     *       500:
     *         description: Internal server error
     */

/**
     * @swagger
     * /v1/category:
     *   post:
     *     summary: Create a Category
     *     tags: [Category]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CategoryCreate'
     *     responses:
     *       201:
     *         description: Category created Successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Category'
     *       400:
     *         description: Invalid data 
     *       500:
     *         description: Internal server error
     */
/**
     * @swagger
     * /v1/category/{id}:
     *   put:
     *     summary: Update category 
     *     tags: [Category]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CategoryUpdate'
     *     responses:
     *       204:
     *         description: Category updated
     *       400:
     *         description: Invalid ID or invalid data
     *       401:
     *         description: Token must be provided
     *       404:
     *         description: Category not found
     *       500:
     *         description: Internal server error
     */
/**
     * @swagger
     * /v1/category/{id}:
     *   delete:
     *     summary: Delete a category 
     *     tags: [Category]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       204:
     *         description: Category deleted
     *       400:
     *         description: Invalid ID
     *       401:
     *         description: Token must be provided
     *       404:
     *         description: Category not found
     *       500:
     *         description: Internal server error
     */