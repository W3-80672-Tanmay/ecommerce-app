import { getAddressById } from '../models/address.model.js';
import { createOrderFromCart, getOrderById, listOrders } from '../models/order.model.js';

export async function placeOrder(req, res, next) {
  try {
    const { address_id, payment_method } = req.body;
    if (payment_method && payment_method !== 'COD') {
      return res.status(400).json({ message: 'Only COD supported currently' });
    }
    const addr = await getAddressById(req.user.sub, Number(address_id));
    if (!addr) return res.status(400).json({ message: 'Invalid address' });

    const orderId = await createOrderFromCart(req.user.sub, Number(address_id), 'COD');
    const order = await getOrderById(req.user.sub, orderId);
    res.status(201).json(order);
  } catch (e) {
    next(e);
  }
}

export async function myOrders(req, res, next) {
  try {
    const rows = await listOrders(req.user.sub);
    res.json(rows);
  } catch (e) {
    next(e);
  }
}

export async function myOrderDetail(req, res, next) {
  try {
    const orderId = Number(req.params.id);
    const order = await getOrderById(req.user.sub, orderId);
    if (!order) return res.status(404).json({ message: 'Not found' });
    res.json(order);
  } catch (e) {
    next(e);
  }
}
