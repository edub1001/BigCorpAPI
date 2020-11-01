import { BaseEntity } from "./baseEntity";
import { Department } from "./department";
import { Office } from "./office";

/**
 * @swagger
 * components:
 *   schemas:
 *       Employee:
 *           type: object
 *           properties:
 *               id:
 *                   description: The given id of the employee.
 *                   type: integer
 *               first:
 *                   description: The first name of the employee
 *                   type: string
 *               last:
 *                   description: The last name of the employee
 *                   type: string
 *               manager:
 *                   description: The employee's manager. It can be the given id of the manager or manager full details as employee
 *                   oneOf:
 *                    - type: integer
 *                    - type: object
 *                      properties:
 *                            id:
 *                                description: The given id of the employee.
 *                                type: integer
 *                            first:
 *                                description: The first name of the employee
 *                                type: string
 *                            last:
 *                                description: The last name of the employee
 *                                type: string
 *                            manager:
 *                               description: The employee's manager. It can be the given id of the manager or manager full details as employee
 *                               type: integer
 *                            department:
 *                                description: The department belonging to. It can be the given id of the department or department full details
 *                                type: integer
 *                            office:
 *                                description: The office where employee works. It can be the given id of the Office or Office full details
 *                                type: integer
 *               department:
 *                   description: The department belonging to. It can be the given id of the department or department full details
 *                   oneOf:
 *                    - type: integer
 *                    - $ref: '#/components/schemas/Department'
 *               office:
 *                   description: The office where employee works. It can be the given id of the Office or Office full details
 *                   oneOf:
 *                    - type: integer
 *                    - $ref: '#/components/schemas/Office'                   
 *           example:
 *               id: 1
 *               first: Eduardo
 *               last: Back
 *               manager: 2
 *               department: 3
 *               office: 4
 */
 export class Employee extends BaseEntity {
    first: string;
    last: string;
    manager: number | Employee;
    department: number | Department;
    office: number | Office;
}