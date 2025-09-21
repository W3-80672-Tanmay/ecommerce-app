import React, { useEffect, useState } from 'react'
import { listProducts, deleteProduct, toggleProductActive } from '../services/api'
import { Link } from 'react-router-dom'

export default function Products(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')

  const load = async ()=>{
    setLoading(true)
    const res = await listProducts(1, 50)
    const arr = res?.items || res || []
    setItems(arr); setLoading(false)
  }
  useEffect(()=>{ load() }, [])

  const doDelete = async (id)=>{
    if(!confirm('Delete this product?')) return
    await deleteProduct(id); await load()
  }
  const doToggle = async (it)=>{
    await toggleProductActive(it.id, it.is_active ? 0 : 1); await load()
  }

  const filtered = items.filter(x => x.name?.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="container">
      <div className="toolbar">
        <input className="search" placeholder="Search products..." value={q} onChange={e=>setQ(e.target.value)} />
        <Link to="/products/new" className="btn">+ Add Product</Link>
      </div>
      {loading ? <div className="card">Loading…</div> : (
        <table className="table">
          <thead><tr><th>Name</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(it => (
              <tr key={it.id}>
                <td>{it.name}</td>
                <td>${it.price}</td>
                <td>{it.stock_quantity}</td>
                <td>{it.is_active ? <span className="badge ok">Active</span> : <span className="badge warn">Inactive</span>}</td>
                <td style={{display:'flex', gap:8}}>
                  <Link className="btn secondary" to={`/products/${it.id}`}>Edit</Link>
                  <button className="btn" onClick={()=>doToggle(it)}>{it.is_active?'Deactivate':'Activate'}</button>
                  <button className="btn danger" onClick={()=>doDelete(it.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
