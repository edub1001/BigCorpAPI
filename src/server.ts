import { app } from './app';
import cors from "cors";
import helmet from "helmet";
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { version, author, description } from '../package.json';

// get port from environment and store in Express.
const port = (process.env.PORT || '3000');
// add swagger configuration
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            version,
            title: "BigCorpAPI",
            description,
            contact: {
                name: author,
                email: "eduardo_back@hotmail.com",
            },
            servers: [{
                url: `${process.env.URL}${port}`,
            }]
        }
    },
    apis: ["src/**/*.ts"]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
// serve swagger in root
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// middleware to add some security basics:  DNS Prefetch Control, Frameguard, Hide Powered-By, etc
app.use(helmet());
app.use(cors());
// create HTTP server to listen
app.listen(port);
