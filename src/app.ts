import express from "express";
import Router from "express-promise-router";
import { addEmployeeRoutes } from "./controllers/employeeRouting";

const app = express();
const router = Router();
app.use(router);

addEmployeeRoutes(router);

export { app };

