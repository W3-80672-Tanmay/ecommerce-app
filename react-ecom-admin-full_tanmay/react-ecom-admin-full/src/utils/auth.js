export const getToken = () => localStorage.getItem('adminToken') || ''
export const setToken = (t) => localStorage.setItem('adminToken', t || '')
export const clearToken = () => localStorage.removeItem('adminToken')
