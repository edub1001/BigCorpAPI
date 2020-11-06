import { OfficeController } from "./officeController";
import { container } from "../inversify.config";
import { HttpStatusCode } from "./baseController";
import { Router } from "express";

export function addOfficeRoutes(router: Router) {
    /**
     * @swagger
     *
     *      /offices:
     *         get:
     *          tags:
     *          - Offices
     *          summary: Get all the offices list in a paginated way.
     *          produces:
     *           - application/json
     *          parameters:
     *           - name: limit
     *             description: Limit used to determine the number of offices to return. By default, limit is 100 and the max limit is 1000
     *             in: query
     *             required: false
     *             type: integer
     *           - name: offset
     *             description: Offset used to determine the index where in the list to start. By default, offset is 0 starting from the beginning
     *             in: query
     *             required: false
     *             type: integer
     *          responses:
     *           200:
     *             description: OK. List of offices matching criteria
     *             content:
     *               application/json:
     *                 schema:
     *                   type: "array"
     *                   items:
     *                      $ref: '#/components/schemas/Office'
     *           400:
     *             description: Bad request.
     *                  Error Code => LIMIT_ERROR. Limit should be greater than 0 and less or equal to 1000
     *                  Error Code => OFFSET_ERROR. Offset should be greater than 0
     *             content:
     *               application/json:
     *                 schema:
     *                      $ref: '#/components/schemas/AppError'
     *           5XX:
     *             description: Unexpected error. Error Code => UNEXPECTED_ERROR. Contact system admin
     *             content:
     *               application/json:
     *                 schema:
     *                      $ref: '#/components/schemas/AppError'
     */
    router.get('/offices', async (req, res) => {
        const officeController = container.get<OfficeController>("OfficeController");
        const limit = req.query.limit;
        const offset = req.query.offset;
        const offices = await officeController.getEntities(limit, offset);
        res.status(HttpStatusCode.OK).send(offices);
    });

    /**
     * @swagger
     *
     *      /offices/{id}:
     *         get:
     *          tags:
     *          - Offices
     *          summary: Get single office by id.
     *          produces:
     *           - application/json
     *          parameters:
     *           - name: id
     *             description: Identifier for office looked for
     *             in: path
     *             required: true
     *             type: integer
     *          responses:
     *           200:
     *             description: OK. Single office matching criteria
     *             content:
     *               application/json:
     *                 schema:
     *                  $ref: '#/components/schemas/Office'
     *           400:
     *             description: Bad request. Error Code => ID_ERROR. Id should be greater than 0
     *             content:
     *               application/json:
     *                 schema:
     *                      $ref: '#/components/schemas/AppError'
     *           404:
     *             description: Not found. Error Code => NOT_FOUND. Office with given id not existing
     *             content:
     *               application/json:
     *                 schema:
     *                      $ref: '#/components/schemas/AppError'
     *           5XX:
     *             description: Unexpected error. Error Code => UNEXPECTED_ERROR. Contact system admin
     *             content:
     *               application/json:
     *                 schema:
     *                      $ref: '#/components/schemas/AppError'
     */
    router.get('/offices/:id', async (req, res) => {
        const officeController = container.resolve(OfficeController);
        const id = req.params.id;
        const office = await officeController.getEntity(id);
        res.status(HttpStatusCode.OK).send(office);
    });
}