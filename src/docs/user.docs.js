    /**
     * @swagger
     * /v1/user/token:
     *   post:
     *     summary: Generates a JWT TOKEN for authentication
     *     tags: [Auth]
     *     security: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UserTokenRequest'
     *     responses:
     *       200:
     *         description: token generated with success
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *       400:
     *         description: Email is required or invalid email format
     *       401:
     *         description: Invalid credentials
     *       500:
     *         description: Internal server error
     */

    /**
     * @swagger
     * /v1/user/search:
     *   get:
     *     summary: Search all users
     *     tags: [User]
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
     *         description: List of users
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 total:
     *                   type: integer
     *                 users:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/User'
     *       400:
     *         description: limit and page must be numbers
     *       500:
     *         description: Internal server error
     */

    /**
     * @swagger
     * /v1/user/{id}:
     *   get:
     *     summary: Search user by ID
     *     tags: [User]
     *     security: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID user
     *     responses:
     *       200:
     *         description: User found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       400:
     *         description: Invalid ID
     *       404:
     *         description: User not found
     *       500:
     *         description: Internal server error
     */
    /**
     * @swagger
     * /v1/user:
     *   post:
     *     summary: Create a User
     *     tags: [User]
     *     security: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UserCreate'
     *     responses:
     *       201:
     *         description: User created Successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       400:
     *         description: Invalid data or password
     *       409:
     *         description: Email already exists
     *       500:
     *         description: Internal server error
     */


    /**
     * @swagger
     * /v1/user/{id}:
     *   put:
     *     summary: Update user 
     *     tags: [User]
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
     *             $ref: '#/components/schemas/UserUpdate'
     *     responses:
     *       204:
     *         description: User updated
     *       400:
     *         description: Invalid ID or invalid data
     *       401:
     *         description: Token must be provided
     *       404:
     *         description: User not found
     *       409:
     *         description: Email already exists
     *       500:
     *         description: Internal server error
     */
    /**
     * @swagger
     * /v1/user/{id}:
     *   delete:
     *     summary: Delete a user 
     *     tags: [User]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       204:
     *         description: User deleted
     *       400:
     *         description: Invalid ID
     *       401:
     *         description: Token must be provided
     *       404:
     *         description: User not found
     *       500:
     *         description: Internal server error
     */