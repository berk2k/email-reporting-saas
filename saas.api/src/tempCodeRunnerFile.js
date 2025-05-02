import express from 'express';
import cors from 'cors';
import { swaggerSpec, swaggerUi } from './swagger.js';  // Swagger setup
import reportSettingRoutes from './routes/reportSettingRoutes.js'; // Your report settings routes
import authRoutes from './routes/authRoutes.js';  // Your authentication routes

const app = express();
app.use(cors());
app.use(express.json());


// First, set up Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Then, set up your application routes
app.use('/api/auth', authRoutes);
app.use('/api/settings', reportSettingRoutes);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
