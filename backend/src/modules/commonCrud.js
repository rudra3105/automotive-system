import { Router } from 'express';
import { createCrudHandlers } from '../utils/crudFactory.js';
export const makeCrudRouter = (model, opts={})=>{
 const r=Router(); const h=createCrudHandlers(model,opts);
 r.get('/',h.list); r.get('/:id',h.get); r.post('/',h.create); r.put('/:id',h.update); r.delete('/:id',h.remove);
 return r;
};
