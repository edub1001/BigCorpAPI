import { DepartmentController } from "./departmentController";
import { container } from "../inversify.config";
import { HttpStatusCode } from "./baseController";
import { Router } from "express";

export function addDepartmentRoutes(router: Router) {
    /**
     * @swagger
     *
     *      /departments:
     *         get:
     *          tags:
     *          - Departments
     *          summary: Get all the departments list in a paginated way with option to expand fields.
     *          produces:
     *           - application/json
     *          parameters:
     *           - name: limit
     *             description: Limit used to determine the number of departments to return. By default, limit is 100 and the max limit is 1000
     *             in: query
     *             required: false
     *             type: integer
     *           - name: offset
     *             description: Offset used to determine the index where in the list to start. By default, offset is 0 starting from the beginning
     *             in: query
     *             required: false
     *             type: integer
     *           - name: expand
     *             description: Expand is used to determine which properties in departments or its relationships to expand. There is one relationship that can be expanded ->
     *              superdepartment in  departments (expands to  departments)
     *             in: query
     *             required: false
     *             type: string
     *          responses:
     *           200:
     *             description: OK. List of departments matching criteria. When an expansion criteria cannot be fulfilled (null, undefined meaning no relationship or id not found), the original unmodified value is returned instead.
     *             content:
     *               application/json:
     *                 schema:
     *                   type: "array"
     *                   items:
     *                      $ref: '#/components/schemas/Department'
     *           400:
     *             description: Bad request.
     *                  Error Code => LIMIT_ERROR. Limit should be greater than 0 and less or equal to 1000
     *                  Error Code => OFFSET_ERROR. Offset should be greater or equal than 0
     *                  Error Code => EXPAND_ERROR. Expandable parameters are not supported
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
    router.get('/departments', async (req, res) => {
        const departmentController = container.get<DepartmentController>(DepartmentController);
        const limit = req.query.limit;
        const offset = req.query.offset;
        const expanders = req.query.expand as string[];
        const departments = await departmentController.getEntities(limit, offset, expanders);
        res.status(HttpStatusCode.OK).json(departments);
    });

    /**
     * @swagger
     *
     *      /departments/{id}:
     *         get:
     *          tags:
     *          - Departments
     *          summary: Get single department by id with option to expand fields.
     *          produces:
     *           - application/json
     *          parameters:
     *           - name: id
     *             description: Identifier for department looked for
     *             in: path
     *             required: true
     *             type: integer
     *           - name: expand
     *             description: Expand is used to determine which properties in departments or its relationships to expand. There is one relationship that can be expanded ->
     *              superdepartment in  departments (expands to  departments)
     *             in: query
     *             required: false
     *             type: string
     *          responses:
     *           200:
     *             description: OK. Single department matching criteria. When an expansion criteria cannot be fulfilled (null, undefined meaning no relationship or id not found), the original unmodified value is returned instead.
     *             content:
     *               application/json:
     *                 schema:
     *                  $ref: '#/components/schemas/Department'
     *           400:
     *             description: Bad request.
     *                  Error Code => ID_ERROR. Id should be greater than 0
     *                  Error Code => EXPAND_ERROR. Expandable parameters are not supported
     *             content:
     *               application/json:
     *                 schema:
     *                      $ref: '#/components/schemas/AppError'
     *           404:
     *             description: Not found. Error Code => NOT_EXISTING. Department with given id not existing
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
    router.get('/departments/:id', async (req, res) => {
        const departmentController = container.get<DepartmentController>(DepartmentController);
        const id = req.params.id;
        const expanders = req.query.expand as string[];
        const department = await departmentController.getEntity(id, expanders);
        res.status(HttpStatusCode.OK).json(department);
    });
}