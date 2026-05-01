export const createCrudHandlers = (model, { include = undefined, orderBy = { createdAt: 'desc' } } = {}) => ({
  list: async (req, res) => {
    const branchId = req.user?.branchId;
    const items = await model.findMany({ where: branchId ? { branchId } : {}, include, orderBy });
    res.json(items);
  },
  get: async (req, res) => {
    const item = await model.findUnique({ where: { id: Number(req.params.id) }, include });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  },
  create: async (req, res) => {
    const data = { ...req.body, branchId: req.body.branchId || req.user?.branchId };
    const item = await model.create({ data, include });
    res.status(201).json(item);
  },
  update: async (req, res) => {
    const item = await model.update({ where: { id: Number(req.params.id) }, data: req.body, include });
    res.json(item);
  },
  remove: async (req, res) => {
    await model.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  }
});
