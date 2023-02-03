import express, { Application, json } from 'express';
import { startDatabase } from './database';
import { createMovieExtra, readMovieExtra } from './extra.logic';

const app: Application = express();
app.use(json());

app.post('/extras', createMovieExtra);
app.get('/extras/:category', readMovieExtra);

app.listen(3000, async () => {
  await startDatabase();
  console.log('Server is running!');
});
