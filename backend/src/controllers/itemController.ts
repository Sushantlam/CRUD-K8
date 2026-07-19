import { Request, Response } from 'express';
import Item from '../models/Item';
import { asyncHandler } from '../middleware/errorHandler';

const getItems = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401);
    throw new Error('Not authorized');
  }
  const items = await Item.find({ owner: userId }).sort({ createdAt: -1 });
  res.json({ items });
});

const getItem = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401);
    throw new Error('Not authorized');
  }
  const item = await Item.findOne({ _id: req.params.id, owner: userId });
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }
  res.json({ item });
});

const createItem = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401);
    throw new Error('Not authorized');
  }
  const { title, description } = req.body;
  if (!title) {
    res.status(400);
    throw new Error('Title is required');
  }
  const item = await Item.create({ title, description, owner: userId });
  res.status(201).json({ item });
});

const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401);
    throw new Error('Not authorized');
  }
  const item = await Item.findOne({ _id: req.params.id, owner: userId });
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  const { title, description, completed } = req.body;
  if (title !== undefined) item.title = title;
  if (description !== undefined) item.description = description;
  if (completed !== undefined) item.completed = completed;

  await item.save();
  res.json({ item });
});

const deleteItem = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401);
    throw new Error('Not authorized');
  }
  const item = await Item.findOneAndDelete({ _id: req.params.id, owner: userId });
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }
  res.json({ message: 'Item deleted', id: req.params.id });
});

export { getItems, getItem, createItem, updateItem, deleteItem };
