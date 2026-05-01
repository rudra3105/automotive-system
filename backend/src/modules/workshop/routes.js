import { Router } from 'express';
import { prisma } from '../../config/db.js';
const router = Router();
router.get('/', async (req,res)=>res.json(await prisma.jobCard.findMany({where:{branchId:req.user.branchId},include:{parts:{include:{part:true}},customer:true},orderBy:{createdAt:'desc'}})));
router.post('/', async (req,res)=>{
 const item=await prisma.jobCard.create({data:{customerId:req.body.customerId,vehiclePlate:req.body.vehiclePlate,complaint:req.body.complaint,mechanicName:req.body.mechanicName,branchId:req.user.branchId}});
 res.status(201).json(item);
});
router.patch('/:id/status', async (req,res)=>res.json(await prisma.jobCard.update({where:{id:Number(req.params.id)},data:{status:req.body.status}})));
router.post('/:id/parts', async (req,res)=>{
 const {partId,quantity}=req.body;
 const part=await prisma.part.findUnique({where:{id:partId}});
 if(!part || part.stock<quantity) return res.status(400).json({message:'Insufficient stock'});
 const result=await prisma.$transaction(async(tx)=>{
   const jcp=await tx.jobCardPart.create({data:{jobCardId:Number(req.params.id),partId,quantity,unitPrice:part.unitPrice}});
   await tx.part.update({where:{id:partId},data:{stock:{decrement:quantity}}});
   return jcp;
 });
 res.status(201).json(result);
});
export default router;
