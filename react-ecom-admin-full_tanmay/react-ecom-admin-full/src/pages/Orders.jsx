import React, { useEffect, useState } from 'react'
import { listOrders, updateOrderStatus } from '../services/api'

export default function Orders(){
  const [items,setItems] = useState([])
  const [loading,setLoading] = useState(true)

  const load = async ()=>{
    setLoading(true)
    const res = await listOrders(1, 50)
    setItems(res?.items || res || [])
    setLoading(false)
  }
  useEffect(()=>{ load() }, [])

  const setStatus = async (id, status)=>{
    await updateOrderStatus(id, status); await load()
  }

  return (
    <div className="container">
      <div className="toolbar"><h2>Orders</h2></div>
      {loading ? <div className="card">Loading…</div> : (
        <table className="table">
          <thead><tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.user_name || o.user_id}</td>
                <td>${o.total_amount || o.total || 0}</td>
                <td><span className="badge">{o.status}</span></td>
                <td style={{display:'flex', gap:8}}>
                  <button className="btn secondary" onClick={()=>setStatus(o.id, 'CONFIRMED')}>Confirm</button>
                  <button className="btn" onClick={()=>setStatus(o.id, 'SHIPPED')}>Ship</button>
                  <button className="btn danger" onClick={()=>setStatus(o.id, 'CANCELLED')}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
