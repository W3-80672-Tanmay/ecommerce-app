import slugify from 'slugify';
import { listProducts, getProductById, getProductImages, createProduct, updateProduct, deleteProduct, setProductActive } from '../models/product.model.js';

export async function getFeaturedProducts(req, res, next) {
  try {
    const data = await listProducts({ featuredOnly: true, activeOnly: true, page: 1, limit: Number(req.query.limit || 12) });
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function getAllProducts(req, res, next) {
  try {
    const { page = 1, limit = 20, search = '', category_id } = req.query;
    const data = await listProducts({
      activeOnly: true,
      page: Number(page),
      limit: Number(limit),
      search: String(search || ''),
      categoryId: category_id ? Number(category_id) : null
    });
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function getProductDetail(req, res, next) {
  try {
    const id = Number(req.params.id);
    const product = await getProductById(id);
    if (!product || !product.is_active) return res.status(404).json({ message: 'Product not found' });
    const images = await getProductImages(id);
    product.images = images;
    res.json(product);
  } catch (e) {
    next(e);
  }
}

/* Admin */
export async function adminListProducts(req, res, next) {
  try {
    const { page = 1, limit = 20, search = '', category_id, active } = req.query;
    const data = await listProducts({
      activeOnly: typeof active === 'undefined' ? false : String(active) === '1',
      page: Number(page),
      limit: Number(limit),
      search: String(search || ''),
      categoryId: category_id ? Number(category_id) : null
    });
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function adminCreateProduct(req, res, next) {
  try {
    const { name, slug, description, price, stock_quantity, is_active = 1, is_featured = 0, category_id, images = [] } = req.body;
    const id = await createProduct({
      name,
      slug: slug || slugify(name, { lower: true }),
      description,
      price,
      stock_quantity,
      is_active,
      is_featured,
      category_id,
      images
    });
    res.status(201).json({ id });
  } catch (e) {
    next(e);
  }
}

export async function adminUpdateProduct(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { name, slug, description, price, stock_quantity, is_active = 1, is_featured = 0, category_id, images } = req.body;
    const ok = await updateProduct(id, {
      name,
      slug: slug || (name ? slugify(name, { lower: true }) : undefined),
      description,
      price,
      stock_quantity,
      is_active,
      is_featured,
      category_id,
      images
    });
    if (!ok) return res.status(404).json({ message: 'Not found' });
    res.json({ updated: true });
  } catch (e) {
    next(e);
  }
}

export async function adminDeleteProduct(req, res, next) {
  try {
    const id = Number(req.params.id);
    const ok = await deleteProduct(id);
    if (!ok) return res.status(404).json({ message: 'Not found' });
    res.json({ deleted: true });
  } catch (e) {
    next(e);
  }
}

export async function adminSetProductActive(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { is_active } = req.body;
    const ok = await setProductActive(id, is_active ? 1 : 0);
    if (!ok) return res.status(404).json({ message: 'Not found' });
    res.json({ updated: true });
  } catch (e) {
    next(e);
  }
}
