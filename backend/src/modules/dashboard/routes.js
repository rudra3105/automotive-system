import { Router } from 'express';
import { prisma } from '../../config/db.js';

const router = Router();

router.get('/', async (req, res) => {
  const branchId = req.user.branchId;

  const [invoiceTotals, pendingJobs, parts, outstandingTotals] = await Promise.all([
    prisma.invoice.aggregate({ where: { branchId }, _sum: { amount: true } }),
    prisma.jobCard.count({ where: { branchId, status: { in: ['PENDING', 'IN_PROGRESS'] } } }),
    prisma.part.findMany({ where: { branchId }, select: { stock: true, unitPrice: true } }),
    prisma.invoice.aggregate({ where: { branchId, paymentStatus: { in: ['UNPAID', 'PARTIAL'] } }, _sum: { amount: true, paidAmount: true } })
  ]);

  const stockValue = parts.reduce((a, p) => a + Number(p.unitPrice) * p.stock, 0);

  res.json({
    dailyRevenue: Number(invoiceTotals._sum.amount || 0),
    pendingJobs,
    stockValue,
    outstanding: Number(outstandingTotals._sum.amount || 0) - Number(outstandingTotals._sum.paidAmount || 0)
  });
});

export default router;
