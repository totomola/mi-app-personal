import express from 'express';
import authRouter from './routes/auth.js';
import finanzasRouter from './routes/finanzas.js';
import credencialesRouter from './routes/credenciales.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Backend funcionando!');
});

app.use('/auth', authRouter);
app.use('/finanzas', finanzasRouter);
app.use('/credenciales', credencialesRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});