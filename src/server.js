import express from 'express';
import cors from 'cors';
import { swaggerSpec, swaggerUi } from './swagger.js';  
import reportSettingRoutes from './routes/reportSettingRoutes.js'; 
import reportRoutes from './routes/reportRoutes.js'
import authRoutes from './routes/authRoutes.js';  
import mailRoutes from './routes/mailRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/api/auth', authRoutes);
app.use('/api/settings', reportSettingRoutes);
app.use('/api/reports',reportRoutes);
app.use('/api/email',mailRoutes)

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
