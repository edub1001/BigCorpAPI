import { BaseEntity } from "./baseEntity";

/**
 * @swagger
 * components:
 *   schemas:
 *       Department:
 *           type: object
 *           properties:
 *               id:
 *                   description: The given id of the department.
 *                   type: integer
 *               name:
 *                   description: The name of the department
 *                   type: string
 *               superdepartment:
 *                   description: The department's superdepartment. It can be the given id of the superdepartment or superdepartment full details as Department
 *                   oneOf:
 *                      - type: integer
 *                      - type: object
 *                        properties:
 *                          id:
 *                              description: The given id of the department.
 *                              type: integer
 *                          name:
 *                              description: The name of the department
 *                              type: string
 *                          superdepartment:
 *                              description: The department's superdepartment. It can be the given id of the superdepartment or superdepartment full details as Department
 *                              type: integer
 *           example:
 *               id: 1
 *               name: IT
 *               superdepartment: 2
 */
export class Department extends BaseEntity  {
    name: string;
    superdepartment: number | Department;
}