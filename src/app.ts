import express from "express";
import { EmployeeController } from "./controllers/employeeController";
import { ParamError } from "./controllers/paramError";
import { container } from "./inversify.config";

const app = express();

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
 *             description: List of employees matching criteria
 *             content:
 *               application/json:
 *                 schema:
 *                  $ref: '#/components/schemas/Employee'
 */
app.get('/employees', async (req, res, next) => {
    try {
        const employeeController = container.get<EmployeeController>("EmployeeController");
        const limit = req.query.limit;
        const offset = req.query.offset;
        const expanders = req.query.expand as string[];
        employeeController.getEmployees(limit, offset, expanders).then(employees => {
            res.status(200).send(employees);
        });
    } catch (error) {
        if (error in ParamError) {
            res.status(400).send(error);
        }
        else {
            next(error);
        }
    }
});

app.get('/employees/:id', async (req, res, next) => {
    try {
        const employeeController = container.resolve(EmployeeController);
        const id = req.params.id;
        const expanders = req.query.expand as string[];
        employeeController.getEmployee(id, expanders).then(employee => {
            if (employee === undefined) {
                res.status(404).send("Not found");
            } else {
                res.status(200).send(employee);
            }
        });
    } catch (error) {
        if (error in ParamError) {
            res.status(400).send(error);
        }
        else {
            next(error);
        }
    }
});

export { app };

