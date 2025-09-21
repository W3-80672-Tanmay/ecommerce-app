import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from '../models/cart.model.js';

export async function getMyCart(req, res, next) {
  try {
    const data = await getCart(req.user.sub);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function addItemToCart(req, res, next) {
  try {
    const { product_id, quantity } = req.body;
    await addToCart(req.user.sub, Number(product_id), Number(quantity || 1));
    const data = await getCart(req.user.sub);
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
}

export async function updateCartItemQuantity(req, res, next) {
  try {
    const productId = Number(req.params.productId);
    const { quantity } = req.body;
    await updateCartItem(req.user.sub, productId, Number(quantity));
    const data = await getCart(req.user.sub);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function removeItemFromCart(req, res, next) {
  try {
    const productId = Number(req.params.productId);
    await removeCartItem(req.user.sub, productId);
    const data = await getCart(req.user.sub);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function clearMyCart(req, res, next) {
  try {
    await clearCart(req.user.sub);
    const data = await getCart(req.user.sub);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
