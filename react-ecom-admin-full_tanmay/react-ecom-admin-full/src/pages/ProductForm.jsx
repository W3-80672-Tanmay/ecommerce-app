import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { listCategories, createProduct, updateProduct, listProducts } from '../services/api'

export default function ProductForm(){
  const nav = useNavigate()
  const { id } = useParams()
  const isEdit = id !== 'new'
  const [cat, setCat] = useState([])
  const [form, setForm] = useState({
    name:'', description:'', price:0, stock_quantity:0, is_active:1, is_featured:0, category_id:'', images: ['']
  })
  const [loading,setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(()=>{
    (async ()=>{
      try{
        const c = await listCategories(); setCat(Array.isArray(c)?c:(c?.items||[]))
        if(isEdit){
          const res = await listProducts(1, 200)
          const arr = res?.items || res || []
          const it = arr.find(x=> String(x.id) === String(id))
          if(it){
            setForm({
              name: it.name || '',
              description: it.description || '',
              price: it.price || 0,
              stock_quantity: it.stock_quantity || 0,
              is_active: it.is_active ?? 1,
              is_featured: it.is_featured ?? 0,
              category_id: it.category_id || '',
              images: it.images?.length? it.images : ['']
            })
          }
        }
      }catch(e){ setError(e.message) }
    })()
  }, [id])

  const submit = async (e)=>{
    e.preventDefault()
    setLoading(true); setError('')
    try{
      const payload = { ...form, price: Number(form.price), stock_quantity: Number(form.stock_quantity), is_active: Number(form.is_active), is_featured: Number(form.is_featured) }
      if(isEdit) await updateProduct(id, payload); else await createProduct(payload)
      nav('/products')
    }catch(e){ setError(e.message) }finally{ setLoading(false) }
  }

  const set = (k,v)=> setForm(s=> ({...s, [k]:v}))

  return (
    <div className="container">
      <h2 style={{marginBottom:12}}>{isEdit?'Edit Product':'Add Product'}</h2>
      <form className="card" onSubmit={submit}>
        <div className="row">
          <div>
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={e=>set('name', e.target.value)} required/>
          </div>
          <div>
            <label className="label">Price</label>
            <input className="input" type="number" value={form.price} onChange={e=>set('price', e.target.value)} step="0.01" required/>
          </div>
          <div>
            <label className="label">Stock Qty</label>
            <input className="input" type="number" value={form.stock_quantity} onChange={e=>set('stock_quantity', e.target.value)} required/>
          </div>
          <div>
            <label className="label">Category</label>
            <select className="select" value={form.category_id} onChange={e=>set('category_id', e.target.value)} required>
              <option value="">Select category</option>
              {cat.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Active</label>
            <select className="select" value={form.is_active} onChange={e=>set('is_active', e.target.value)}>
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </select>
          </div>
          <div>
            <label className="label">Featured</label>
            <select className="select" value={form.is_featured} onChange={e=>set('is_featured', e.target.value)}>
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </div>
          <div style={{gridColumn:'1 / -1'}}>
            <label className="label">Description</label>
            <textarea className="textarea" rows={4} value={form.description} onChange={e=>set('description', e.target.value)} />
          </div>
          <div style={{gridColumn:'1 / -1'}}>
            <label className="label">Image URLs (comma separated)</label>
            <input className="input" value={form.images.join(',')} onChange={e=>set('images', e.target.value.split(',').map(s=>s.trim()))} placeholder="https://..." />
          </div>
        </div>

        {error && <div style={{color:'#fca5a5',marginTop:8}}>{error}</div>}
        <div style={{display:'flex',justifyContent:'flex-end', gap:10, marginTop:16}}>
          <button type="button" className="btn secondary" onClick={()=>history.back()}>Cancel</button>
          <button className="btn" disabled={loading}>{loading?'Saving…':'Save'}</button>
        </div>
      </form>
    </div>
  )
}
