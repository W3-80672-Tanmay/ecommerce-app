import { getToken, clearToken } from '../utils/auth'

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

async function request(path, { method='GET', body, auth=true } = {}){
  const headers = { 'Content-Type': 'application/json' }
  if(auth){
    const tok = getToken()
    if(tok) headers['Authorization'] = `Bearer ${tok}`
  }
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined })
  if(res.status === 401){ clearToken(); throw new Error('Unauthorized') }
  if(!res.ok){
    const msg = await res.text().catch(()=>res.statusText)
    throw new Error(msg || 'Request failed')
  }
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : res.text()
}

// Auth
export const loginAdmin = (email, password) => request('/admin/login', { method:'POST', body:{ email, password }, auth:false })

// Products
export const listProducts = (page=1, limit=20) => request(`/admin/products?page=${page}&limit=${limit}`)
export const createProduct = (data) => request('/admin/products', { method:'POST', body:data })
export const updateProduct = (id, data) => request(`/admin/products/${id}`, { method:'PUT', body:data })
export const toggleProductActive = (id, is_active) => request(`/admin/products/${id}/activate`, { method:'PATCH', body:{ is_active } })
export const deleteProduct = (id) => request(`/admin/products/${id}`, { method:'DELETE' })

// Categories
export const listCategories = () => request('/admin/categories')
export const createCategory = (data) => request('/admin/categories', { method:'POST', body:data })
export const updateCategory = (id, data) => request(`/admin/categories/${id}`, { method:'PUT', body:data })
export const deleteCategory = (id) => request(`/admin/categories/${id}`, { method:'DELETE' })

// Orders
export const listOrders = (page=1, limit=20) => request(`/admin/orders?page=${page}&limit=${limit}`)
export const updateOrderStatus = (id, status) => request(`/admin/orders/${id}/status`, { method:'PATCH', body:{ status } })

// Settings (example)
export const getSettings = () => request('/admin/settings')
export const upsertSetting = (key, value) => request(`/admin/settings/${key}`, { method:'PUT', body:{ value } })
