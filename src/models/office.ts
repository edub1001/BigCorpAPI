import { BaseEntity } from "./baseEntity";

/**
 * @swagger
 * components:
 *   schemas:
 *       Office:
 *           type: object
 *           properties:
 *               id:
 *                   description: The given id of the office.
 *                   type: integer
 *               city:
 *                   description: The city where the office is located
 *                   type: string
 *               country:
 *                   description: The country where the office is located
 *                   type: string
 *               address:
 *                   description: The address where the office is located
 *                   type: string
 *           example:
 *               id: 1
 *               city: Buenos Aires
 *               country: Argentina
 *               address: Av. Estado de Israel 4354
 */
export class Office extends BaseEntity {
    city: string;
    country: string;
    address: string;
}