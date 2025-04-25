// src/server.js
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import { swaggerSpec, swaggerUi } from './swagger.js';
import { config } from './config/config.js';


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes); // Prefixes your auth routes



app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
  console.log(`Swagger documentation available at http://localhost:${config.port}/api-docs`);
});