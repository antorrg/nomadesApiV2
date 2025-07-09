/**
* @swagger
* tags:
*   - name: Landing
*     description: Operaciones relacionadas con landing
 */

/**
* @swagger
* '/api/v2/land/create':
*   post:
*     summary: Crear un nuevo landing
*     tags: [Landing]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*                - title
*                - image
*                - info_header
*                - description
*             properties:
*             title:
*               type: string
*               example: title ejemplo
*               description: Descripción de title
*             image:
*               type: string
*               example: image ejemplo
*               description: Descripción de image
*             info_header:
*               type: string
*               example: info_header ejemplo
*               description: Descripción de info_header
*             description:
*               type: string
*               example: description ejemplo
*               description: Descripción de description
*             useImg:
*               type: boolean
*               example: true
*               description: Descripción de useImg
*             saver:
*               type: boolean
*               example: true
*               description: Descripción de saver
*     responses:
*       201:
*         description: Creación exitosa
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                 message:
*                   type: string
*                 results:
*                   $ref: '#/components/schemas/Landing'
 */

/**
* @swagger
* '/api/v2/land':
*   get:
*     summary: Obtener todos los landings
*     tags: [Landing]
*     parameters:
*       - in: query
*         name:
*         required: false
*         schema:
*           type: string
*         description:
*     responses:
*       200:
*         description: Lista de landings
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Landing'
 */

/**
* @swagger
* '/api/v2/land/{id}':
*   put:
*     summary: Actualizar un landing
*     tags: [Landing]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*         description: Id de landing
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*             title:
*               type: string
*               example: title ejemplo
*               description: Descripción de title
*             image:
*               type: string
*               example: image ejemplo
*               description: Descripción de image
*             info_header:
*               type: string
*               example: info_header ejemplo
*               description: Descripción de info_header
*             description:
*               type: string
*               example: description ejemplo
*               description: Descripción de description
*             useImg:
*               type: boolean
*               example: true
*               description: Descripción de useImg
*             saver:
*               type: boolean
*               example: true
*               description: Descripción de saver
*     responses:
*       200:
*         description: Actualización exitosa
*       400:
*         description: Error de validación
 */
