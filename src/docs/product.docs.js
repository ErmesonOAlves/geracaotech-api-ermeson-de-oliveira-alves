/**
 * @swagger
 * /VQ/{id}:
 *   delete:
 *     summary: Deleta um produto
 *     description: Deleta um produto com o ID especificado.
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do produto a ser deletado.
 *     responses:
 *       204:
 *         description: Produto deletado com sucesso.
 */
