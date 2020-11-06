import { EmployeeController } from "./employeeController";
import { container } from "../inversify.config";
import { HttpStatusCode } from "./baseController";
import { Router } from "express";

export function addEmployeeRoutes(router: Router) {
    /**
     * @swagger
     *
     *      /employees:
     *         get:
     *          tags:
     *          - Employees
     *          summary: Get all the employees list in a paginated way with option to expand fields.
     *          produces:
     *           - application/json
     *          parameters:
     *           - name: limit
     *             description: Limit used to determine the number of employees to return. By default, limit is 100 and the max limit is 1000
     *             in: query
     *             required: false
     *             type: integer
     *           - name: offset
     *             description: Offset used to determine the index where in the list to start. By default, offset is 0 starting from the beginning
     *             in: query
     *             required: false
     *             type: integer
     *           - name: expand
     *             description: Expand is used to determine which properties in employee or its relationships to expand. There are four relationships that can be expanded ->
     *              manager in  employees (expands to  employees); office  in  employees  (expands to  offices); department  in  employees  (expands to  departments);
     *              superdepartment in  departments (expands to  departments)
     *             in: query
     *             required: false
     *             type: string
     *          responses:
     *           200:
     *             description: OK. List of employees matching criteria
     *             content:
     *               application/json:
     *                 schema:
     *                   type: "array"
     *                   items:
     *                      $ref: '#/components/schemas/Employee'
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
    router.get('/employees', async (req, res) => {
        const employeeController = container.get<EmployeeController>("EmployeeController");
        const limit = req.query.limit;
        const offset = req.query.offset;
        const expanders = req.query.expand as string[];
        const employees = await employeeController.getEntities(limit, offset, expanders);
        res.status(HttpStatusCode.OK).send(employees);
    });

    /**
     * @swagger
     *
     *      /employees/{id}:
     *         get:
     *          tags:
     *          - Employees
     *          summary: Get single employee by id with option to expand fields.
     *          produces:
     *           - application/json
     *          parameters:
     *           - name: id
     *             description: Identifier for employee looked for
     *             in: path
     *             required: true
     *             type: integer
     *           - name: expand
     *             description: Expand is used to determine which properties in employee or its relationships to expand. There are four relationships that can be expanded ->
     *              manager in  employees (expands to  employees); office  in  employees  (expands to  offices); department  in  employees  (expands to  departments);
     *              superdepartment in  departments (expands to  departments)
     *             in: query
     *             required: false
     *             type: string
     *          responses:
     *           200:
     *             description: OK. Single employee matching criteria
     *             content:
     *               application/json:
     *                 schema:
     *                  $ref: '#/components/schemas/Employee'
     *           400:
     *             description: Bad request.
     *                  Error Code => ID_ERROR. Id should be greater than 0
     *                  Error Code => EXPAND_ERROR. Expandable parameters are not supported
     *             content:
     *               application/json:
     *                 schema:
     *                      $ref: '#/components/schemas/AppError'
     *           404:
     *             description: Not found. Error Code => NOT_FOUND. Employee with given id not existing
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
    router.get('/employees/:id', async (req, res) => {
        const employeeController = container.resolve(EmployeeController);
        const id = req.params.id;
        const expanders = req.query.expand as string[];
        const employee = await employeeController.getEntity(id, expanders);
        res.status(HttpStatusCode.OK).send(employee);
    });
}