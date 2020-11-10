import express from "express";
import Router from "express-promise-router";
import { addDepartmentRoutes } from "./controllers/departmentRouting";
import { addEmployeeRoutes } from "./controllers/employeeRouting";
import { errorMiddleware } from "./controllers/errorMiddleware";
import { addOfficeRoutes } from "./controllers/officeRouting";
import { getContainer } from "./inversify.config";

const app = express();
const router = Router();
app.use(router);

const container = getContainer();

addEmployeeRoutes(router);
addDepartmentRoutes(router);
addOfficeRoutes(router);

app.use(errorMiddleware);

export { app, container };

