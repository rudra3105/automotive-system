import { Router } from 'express';
import { prisma } from '../../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const router = Router();
router.post('/login', async (req,res)=>{
 const {email,password}=req.body;
 const user=await prisma.user.findUnique({where:{email}});
 if(!user || !(await bcrypt.compare(password,user.password))) return res.status(401).json({message:'Invalid credentials'});
 const token=jwt.sign({id:user.id,role:user.role,branchId:user.branchId,email:user.email},process.env.JWT_SECRET,{expiresIn:'1d'});
 res.json({token,user:{id:user.id,email:user.email,role:user.role,fullName:user.fullName,branchId:user.branchId}});
});
router.get('/me', async (req,res)=> res.json(req.user));
export default router;
