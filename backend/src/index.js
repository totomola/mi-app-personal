import express from 'express';
import { prisma } from './db.js';
import authRouter from './routes/auth.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Backend funcionando!');
});

app.get('/usuarios', async (req, res) => {
  const usuarios = await prisma.user.findMany();
  res.json(usuarios);
});

app.use('/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});