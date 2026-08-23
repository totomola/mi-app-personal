import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', async (req, res) => {
  const { amount, type, category, currency, description, date } = req.body;

  if (!amount || !type || !category) {
    return res.status(400).json({ error: 'amount, type y category son obligatorios' });
  }

  const transaction = await prisma.transaction.create({
    data: {
      amount,
      type,
      category,
      currency: currency || 'ARS',
      description,
      date: date ? new Date(date) : undefined,
      userId: req.userId,
    },
  });

  res.status(201).json(transaction);
});

router.get('/', async (req, res) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId: req.userId },
    orderBy: { date: 'desc' },
  });
  res.json(transactions);
});

router.get('/resumen', async (req, res) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId: req.userId },
  });

  const resumen = {};

  for (const t of transactions) {
    if (!resumen[t.currency]) {
      resumen[t.currency] = { ingresos: 0, gastos: 0, balance: 0 };
    }
    if (t.type === 'INGRESO') {
      resumen[t.currency].ingresos += t.amount;
    } else {
      resumen[t.currency].gastos += t.amount;
    }
    resumen[t.currency].balance = resumen[t.currency].ingresos - resumen[t.currency].gastos;
  }

  res.json(resumen);
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { amount, type, category, currency, description, date } = req.body;

  const transaction = await prisma.transaction.findUnique({ where: { id: Number(id) } });

  if (!transaction || transaction.userId !== req.userId) {
    return res.status(404).json({ error: 'Movimiento no encontrado' });
  }

  const updated = await prisma.transaction.update({
    where: { id: Number(id) },
    data: { amount, type, category, currency, description, date: date ? new Date(date) : undefined },
  });

  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const transaction = await prisma.transaction.findUnique({ where: { id: Number(id) } });

  if (!transaction || transaction.userId !== req.userId) {
    return res.status(404).json({ error: 'Movimiento no encontrado' });
  }

  await prisma.transaction.delete({ where: { id: Number(id) } });

  res.status(204).send();
});

export default router;