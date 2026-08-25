import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticate } from '../middleware/auth.js';
import { encrypt, decrypt } from '../utils/crypto.js';

const router = Router();

router.use(authenticate);

router.post('/', async (req, res) => {
  const { siteName, siteUrl, username, password, notes } = req.body;

  if (!siteName || !username || !password) {
    return res.status(400).json({ error: 'siteName, username y password son obligatorios' });
  }

  const { encryptedPassword, iv, authTag } = encrypt(password);

  const credential = await prisma.credential.create({
    data: {
      siteName,
      siteUrl,
      username,
      encryptedPassword,
      iv,
      authTag,
      notes,
      userId: req.userId,
    },
  });

  res.status(201).json({
    id: credential.id,
    siteName: credential.siteName,
    siteUrl: credential.siteUrl,
    username: credential.username,
    notes: credential.notes,
    createdAt: credential.createdAt,
  });
});

router.get('/', async (req, res) => {
  const credentials = await prisma.credential.findMany({
    where: { userId: req.userId },
    orderBy: { siteName: 'asc' },
  });

  const result = credentials.map((c) => ({
    id: c.id,
    siteName: c.siteName,
    siteUrl: c.siteUrl,
    username: c.username,
    password: decrypt({ encryptedPassword: c.encryptedPassword, iv: c.iv, authTag: c.authTag }),
    notes: c.notes,
    createdAt: c.createdAt,
  }));

  res.json(result);
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { siteName, siteUrl, username, password, notes } = req.body;

  const credential = await prisma.credential.findUnique({ where: { id: Number(id) } });

  if (!credential || credential.userId !== req.userId) {
    return res.status(404).json({ error: 'Credencial no encontrada' });
  }

  const data = { siteName, siteUrl, username, notes };

  if (password) {
    const { encryptedPassword, iv, authTag } = encrypt(password);
    data.encryptedPassword = encryptedPassword;
    data.iv = iv;
    data.authTag = authTag;
  }

  const updated = await prisma.credential.update({
    where: { id: Number(id) },
    data,
  });

  res.json({
    id: updated.id,
    siteName: updated.siteName,
    siteUrl: updated.siteUrl,
    username: updated.username,
    notes: updated.notes,
    createdAt: updated.createdAt,
  });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const credential = await prisma.credential.findUnique({ where: { id: Number(id) } });

  if (!credential || credential.userId !== req.userId) {
    return res.status(404).json({ error: 'Credencial no encontrada' });
  }

  await prisma.credential.delete({ where: { id: Number(id) } });

  res.status(204).send();
});

export default router;