import swaggerJSDoc, { Options } from 'swagger-jsdoc';
import { env } from '../config/env.js';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: env.SWAGGER_TITLE,
      version: env.SWAGGER_VERSION,
      description: env.SWAGGER_DESCRIPTION
    },
    servers: [{ url: 'http://localhost:' + env.PORT }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  // يكفي النمط النسبي، ويعمل على ويندوز مع swagger-jsdoc
  apis: ['src/modules/**/*.routes.ts']
};

export const swaggerSpec = swaggerJSDoc(options);
