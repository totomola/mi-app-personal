import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../db.js';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ error: 'Ese email ya está registrado' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, passwordHash },
  });

  res.status(201).json({ id: user.id, email: user.email });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.json({ token });
});

router.get('/me', authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, email: true, createdAt: true },
  });
  res.json(user);
});

router.post('/pin', authenticate, async (req, res) => {
  const { password, newPin } = req.body;

  if (!password || !newPin) {
    return res.status(400).json({ error: 'password y newPin son obligatorios' });
  }

  const user = await prisma.user.findUnique({ where: { id: req.userId } });

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }

  const pinHash = await bcrypt.hash(newPin, 10);

  await prisma.user.update({
    where: { id: req.userId },
    data: { pinHash },
  });

  res.status(200).json({ message: 'PIN actualizado' });
});

router.post('/pin/verify', authenticate, async (req, res) => {
  const { pin } = req.body;

  if (!pin) {
    return res.status(400).json({ error: 'pin es obligatorio' });
  }

  const user = await prisma.user.findUnique({ where: { id: req.userId } });

  if (!user.pinHash) {
    return res.status(400).json({ error: 'Todavía no configuraste un PIN' });
  }

  const pinMatches = await bcrypt.compare(pin, user.pinHash);

  if (!pinMatches) {
    return res.status(401).json({ error: 'PIN incorrecto' });
  }

  res.status(200).json({ valid: true });
});

export default router;