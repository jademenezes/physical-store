import express from 'express';

import storeRouter from './routes/storeRouter';

const app = express();

// Middleware
// Body parsing
app.use(express.json({ limit: '10kb' }));

//Montando Rotas
app.use('/api/v1/lojas', storeRouter);

export default app;
