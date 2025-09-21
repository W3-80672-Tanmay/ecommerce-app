import React, { useEffect, useState } from 'react'
import { listProducts, listCategories, listOrders } from '../services/api'

export default function Dashboard(){
  const [stats, setStats] = useState({ products:0, categories:0, orders:0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(()=>{
    async function load(){
      try{
        const [p,c,o] = await Promise.all([listProducts(1,1), listCategories(), listOrders(1,1)])
        setStats({
          products: p?.items?.length ? p.total || p.items.length : (Array.isArray(p)?p.length:0),
          categories: Array.isArray(c) ? c.length : (c?.items?.length || 0),
          orders: o?.items?.length ? (o.total || o.items.length) : (Array.isArray(o)?o.length:0),
        })
      }catch(e){ setError(e.message) }finally{ setLoading(false) }
    }
    load()
  }, [])

  return (
    <div className="container">
      <h1 style={{marginBottom:16}}>Dashboard</h1>
      {error && <div className="card" style={{borderColor:'#7f1d1d', marginBottom:12}}>Error: {error}</div>}
      <div className="grid cols-3">
        <div className="card kpi"><div className="num">{loading?'…':stats.products}</div><div><div className="muted">Products</div></div></div>
        <div className="card kpi"><div className="num">{loading?'…':stats.categories}</div><div><div className="muted">Categories</div></div></div>
        <div className="card kpi"><div className="num">{loading?'…':stats.orders}</div><div><div className="muted">Orders</div></div></div>
      </div>
    </div>
  )
}
