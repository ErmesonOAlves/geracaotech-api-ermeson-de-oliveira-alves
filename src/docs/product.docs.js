/**
     * @swagger
     * /v1/product/search:
     *   get:
     *     summary: Search all products
     *     tags: [Product]
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
     *         description: List of products
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 total:
     *                   type: integer
     *                 products:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Product'
     *       400:
     *         description: limit and page must be numbers
     *       500:
     *         description: Internal server error
     */
     /**
     * @swagger
     * /v1/product/{id}:
     *   get:
     *     summary: Search product by ID
     *     tags: [Product]
     *     security: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: product id
     *     responses:
     *       200:
     *         description: Product found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Product'
     *       400:
     *         description: Invalid ID
     *       404:
     *         description: Product not found
     *       500:
     *         description: Internal server error
     */
    /**
     * @swagger
     * /v1/product:
     *   post:
     *     summary: Create a Product
     *     tags: [Product]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ProductCreate'
     *     responses:
     *       201:
     *         description: Product created Successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Product'
     *       400:
     *         description: Invalid data 
     *       500:
     *         description: Internal server error
     */
/**
     * @swagger
     * /v1/product/{id}:
     *   put:
     *     summary: Update product 
     *     tags: [Product]
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
     *             $ref: '#/components/schemas/ProductUpdate'
     *     responses:
     *       204:
     *         description: Product updated
     *       400:
     *         description: Invalid ID or invalid data
     *       401:
     *         description: Token must be provided
     *       404:
     *         description: Product not found
     *       500:
     *         description: Internal server error
     */