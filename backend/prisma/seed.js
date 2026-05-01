import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main(){
 const branch = await prisma.branch.create({data:{name:'Main Branch', code:'MB1', currency:'USD'}});
 const password = await bcrypt.hash('admin123',10);
 await prisma.user.create({data:{email:'admin@uos.com',password,fullName:'System Admin',role:Role.ADMIN,branchId:branch.id}});
 const customer = await prisma.customer.create({data:{name:'Acme Logistics',phone:'+12345678',branchId:branch.id}});
 await prisma.part.createMany({data:[{sku:'FLT-001',name:'Oil Filter',unitPrice:20,stock:100,branchId:branch.id},{sku:'BRK-001',name:'Brake Pad',unitPrice:35,stock:50,branchId:branch.id}]});
 await prisma.vehicle.create({data:{vin:'VIN0001',make:'Isuzu',model:'NPR',year:2024,price:45000,branchId:branch.id}});
 await prisma.lead.create({data:{name:'Transit Co',phone:'+445566',source:'walk-in',branchId:branch.id}});
 await prisma.jobCard.create({data:{customerId:customer.id,vehiclePlate:'ABC-123',complaint:'Engine noise',branchId:branch.id}});
}
main().finally(()=>prisma.$disconnect());
