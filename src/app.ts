import express from "express";
import Router from "express-promise-router";
import { addDepartmentRoutes } from "./controllers/departmentRouting";
import { addEmployeeRoutes } from "./controllers/employeeRouting";
import { errorMiddleware } from "./controllers/errorMiddleware";
import { addOfficeRoutes } from "./controllers/officeRouting";
import { getContainer } from "./inversify.config";

// we create and app in this file that will handle the routes defined but will not still listen to port
// which is delegated to the server file
const app = express();
const router = Router();
app.use(router);

const container = getContainer();

// add all the app routes that we have now
addEmployeeRoutes(router);
addDepartmentRoutes(router);
addOfficeRoutes(router);
// register the global error handler middleware
app.use(errorMiddleware);

export { app, container };

