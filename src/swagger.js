// src/swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'SaaS Project API',
    version: '1.0.0',
    description: 'API documentation for the SaaS project, including user registration and login.',
  },
  servers: [
    {
      url: 'http://localhost:3000/api', // Make sure this matches your base route
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'], // Ensure the paths are correct
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec, swaggerUi };
