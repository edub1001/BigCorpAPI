import express from "express";
import Router from "express-promise-router";
import { addEmployeeRoutes } from "./controllers/employeeRouting";
import { addDepartmentRoutes } from "./controllers/departmentRouting";
import { addOfficeRoutes } from "./controllers/officeRouting";

const app = express();
const router = Router();
app.use(router);

addEmployeeRoutes(router);
addDepartmentRoutes(router);
addOfficeRoutes(router);

export { app };

