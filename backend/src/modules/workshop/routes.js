import { Router } from 'express';
import { prisma } from '../../config/db.js';

const router = Router();

router.get('/', async (req, res) => {
  const list = await prisma.jobCard.findMany({
    where: { branchId: req.user.branchId },
    include: { parts: { include: { part: true } }, customer: true, invoice: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(list);
});

router.post('/', async (req, res) => {
  const item = await prisma.jobCard.create({
    data: {
      customerId: Number(req.body.customerId),
      vehiclePlate: req.body.vehiclePlate,
      complaint: req.body.complaint,
      mechanicName: req.body.mechanicName,
      branchId: req.user.branchId
    }
  });
  res.status(201).json(item);
});

router.patch('/:id/status', async (req, res) => {
  const job = await prisma.jobCard.findFirst({ where: { id: Number(req.params.id), branchId: req.user.branchId } });
  if (!job) return res.status(404).json({ message: "Job card not found" });
  const item = await prisma.jobCard.update({ where: { id: job.id }, data: { status: req.body.status } });
  res.json(item);
});

router.post('/:id/parts', async (req, res) => {
  const { partId, quantity } = req.body;
  const q = Number(quantity);
  const pid = Number(partId);
  const jobCardId = Number(req.params.id);

  const part = await prisma.part.findFirst({ where: { id: pid, branchId: req.user.branchId } });
  if (!part || part.stock < q) return res.status(400).json({ message: 'Insufficient stock' });

  const result = await prisma.$transaction(async (tx) => {
    const jcp = await tx.jobCardPart.create({
      data: { jobCardId, partId: pid, quantity: q, unitPrice: part.unitPrice }
    });
    await tx.part.update({ where: { id: pid }, data: { stock: { decrement: q } } });
    return jcp;
  });

  res.status(201).json(result);
});

router.post('/:id/generate-invoice', async (req, res) => {
  const jobCardId = Number(req.params.id);
  const job = await prisma.jobCard.findFirst({
    where: { id: jobCardId, branchId: req.user.branchId },
    include: { parts: true, customer: true }
  });

  if (!job) return res.status(404).json({ message: 'Job card not found' });
  if (job.invoiceId) return res.status(400).json({ message: 'Invoice already generated' });

  const partsTotal = job.parts.reduce((sum, p) => sum + Number(p.unitPrice) * p.quantity, 0);
  const laborTotal = Number(job.laborCost || 0);
  const total = partsTotal + laborTotal;

  const invoice = await prisma.$transaction(async (tx) => {
    const created = await tx.invoice.create({
      data: {
        reference: `SRV-${Date.now()}`,
        type: 'SERVICE',
        customerId: job.customerId,
        amount: total,
        currency: req.body.currency || 'USD',
        branchId: req.user.branchId
      }
    });

    await tx.jobCard.update({ where: { id: jobCardId }, data: { invoiceId: created.id, status: 'COMPLETED' } });
    await tx.ledgerEntry.create({
      data: {
        description: `Service invoice ${created.reference}`,
        type: 'INCOME',
        amount: total,
        currency: created.currency,
        branchId: req.user.branchId
      }
    });
    return created;
  });

  res.status(201).json(invoice);
});

export default router;
