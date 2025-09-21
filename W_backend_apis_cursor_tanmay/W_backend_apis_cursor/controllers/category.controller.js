import slugify from 'slugify';
import { listCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../models/category.model.js';
import { listProducts } from '../models/product.model.js';

export async function getAllCategories(req, res, next) {
  try {
    const categories = await listCategories(true);
    res.json(categories);
  } catch (e) {
    next(e);
  }
}

export async function getCategoryProducts(req, res, next) {
  try {
    const id = Number(req.params.id);
    const category = await getCategoryById(id);
    if (!category || !category.is_active) return res.status(404).json({ message: 'Category not found' });
    const products = await listProducts({ categoryId: id, activeOnly: true, page: Number(req.query.page || 1), limit: Number(req.query.limit || 20) });
    res.json(products);
  } catch (e) {
    next(e);
  }
}

/* Admin */
export async function adminListCategories(req, res, next) {
  try {
    const categories = await listCategories(false);
    res.json(categories);
  } catch (e) {
    next(e);
  }
}

export async function adminCreateCategory(req, res, next) {
  try {
    const { name, slug, is_active = 1 } = req.body;
    const id = await createCategory({ name, slug: slug || slugify(name, { lower: true }), is_active });
    res.status(201).json({ id });
  } catch (e) {
    next(e);
  }
}

export async function adminUpdateCategory(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { name, slug, is_active = 1 } = req.body;
    const ok = await updateCategory(id, { name, slug: slug || slugify(name, { lower: true }), is_active });
    if (!ok) return res.status(404).json({ message: 'Not found' });
    res.json({ updated: true });
  } catch (e) {
    next(e);
  }
}

export async function adminDeleteCategory(req, res, next) {
  try {
    const id = Number(req.params.id);
    const ok = await deleteCategory(id);
    if (!ok) return res.status(404).json({ message: 'Not found' });
    res.json({ deleted: true });
  } catch (e) {
    next(e);
  }
}
