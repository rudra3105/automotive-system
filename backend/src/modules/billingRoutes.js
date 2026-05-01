import { Router } from 'express';
import { prisma } from '../config/db.js';
import { makeCrudRouter } from './commonCrud.js';

const router = Router();
router.use('/', makeCrudRouter(prisma.invoice));

router.patch('/:id/payment', async (req, res) => {
  const id = Number(req.params.id);
  const paidDelta = Number(req.body.paidAmount || 0);
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice || invoice.branchId !== req.user.branchId) return res.status(404).json({ message: 'Invoice not found' });

  const nextPaid = Number(invoice.paidAmount) + paidDelta;
  const paymentStatus = nextPaid <= 0 ? 'UNPAID' : nextPaid < Number(invoice.amount) ? 'PARTIAL' : 'PAID';

  const updated = await prisma.$transaction(async (tx) => {
    const inv = await tx.invoice.update({ where: { id }, data: { paidAmount: nextPaid, paymentStatus } });
    await tx.ledgerEntry.create({
      data: {
        description: `Payment received for ${inv.reference}`,
        type: 'INCOME',
        amount: paidDelta,
        currency: inv.currency,
        branchId: inv.branchId
      }
    });
    return inv;
  });

  res.json(updated);
});

export default router;
