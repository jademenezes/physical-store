import mongoose from 'mongoose';
import app from './app';
import { SERVER_PORT, MONGODB } from './config/config';

const DB = MONGODB.DATABASE.replace('<USERNAME>', MONGODB.DB_USERNAME).replace(
  '<PASSWORD>',
  MONGODB.DB_PASSWORD,
);

mongoose.connect(DB).then(() => {
  console.log('Database connection successful!');
});

app.listen(SERVER_PORT, () => {
  console.log(`Server running on port ${SERVER_PORT}`);
});
