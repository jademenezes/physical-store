import mongoose from 'mongoose';
import app from './app';
import { SERVER_PORT, MONGODB } from './config/config';
import logger from './config/logger';

const DB = MONGODB.DATABASE.replace('<USERNAME>', MONGODB.DB_USERNAME).replace(
  '<PASSWORD>',
  MONGODB.DB_PASSWORD,
);

mongoose.connect(DB).then(() => {
  logger.info('Conexão com o Banco de Dados bem sucedida!');
});

app.listen(SERVER_PORT, () => {
  logger.info(`Servidor ativo na porta ${SERVER_PORT}`);
});
