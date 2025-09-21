import { createAddress, deleteAddress, getAddressById, listAddresses, updateAddress } from '../models/address.model.js';

export async function listMyAddresses(req, res, next) {
  try {
    const rows = await listAddresses(req.user.sub);
    res.json(rows);
  } catch (e) {
    next(e);
  }
}

export async function addAddress(req, res, next) {
  try {
    const id = await createAddress(req.user.sub, req.body);
    const addr = await getAddressById(req.user.sub, id);
    res.status(201).json(addr);
  } catch (e) {
    next(e);
  }
}

export async function editAddress(req, res, next) {
  try {
    const id = Number(req.params.id);
    const ok = await updateAddress(req.user.sub, id, req.body);
    if (!ok) return res.status(404).json({ message: 'Not found' });
    const addr = await getAddressById(req.user.sub, id);
    res.json(addr);
  } catch (e) {
    next(e);
  }
}

export async function removeAddress(req, res, next) {
  try {
    const id = Number(req.params.id);
    const ok = await deleteAddress(req.user.sub, id);
    if (!ok) return res.status(404).json({ message: 'Not found' });
    res.json({ deleted: true });
  } catch (e) {
    next(e);
  }
}
