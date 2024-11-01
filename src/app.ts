import express from 'express';

import storeRouter from './routes/storeRouter';
import errorHandler from './middlewares/errorHandler';

const app = express();

// Middleware
// Body parsing
app.use(express.json({ limit: '10kb' }));

//Montando Rotas
app.use('/api/v1/lojas', storeRouter);

//global error handling middleware
app.use(errorHandler);

export default app;
