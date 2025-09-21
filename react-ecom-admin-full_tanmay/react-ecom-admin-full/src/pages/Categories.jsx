import React, { useEffect, useState } from 'react'
import { listCategories, createCategory, updateCategory, deleteCategory } from '../services/api'

export default function Categories(){
  const [items,setItems] = useState([])
  const [name,setName] = useState('')
  const [editing,setEditing] = useState(null)

  const load = async ()=>{
    const res = await listCategories()
    setItems(res?.items || res || [])
  }
  useEffect(()=>{ load() }, [])

  const submit = async (e)=>{
    e.preventDefault()
    if(editing){
      await updateCategory(editing.id, { name, slug:'', is_active:1 })
      setEditing(null)
    }else{
      await createCategory({ name, slug:'', is_active:1 })
    }
    setName(''); await load()
  }

  return (
    <div className="container">
      <div className="card" style={{marginBottom:16}}>
        <form onSubmit={submit} style={{display:'flex', gap:12}}>
          <input className="input" placeholder="Category name" value={name} onChange={e=>setName(e.target.value)} required />
          <button className="btn">{editing?'Update':'Add'}</button>
          {editing && <button type="button" className="btn secondary" onClick={()=>{ setEditing(null); setName('') }}>Cancel</button>}
        </form>
      </div>

      <table className="table">
        <thead><tr><th>Name</th><th>ID</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map(c=> (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td className="muted">{c.id}</td>
              <td style={{display:'flex', gap:8}}>
                <button className="btn secondary" onClick={()=>{ setEditing(c); setName(c.name) }}>Edit</button>
                <button className="btn danger" onClick={async()=>{ if(confirm('Delete?')){ await deleteCategory(c.id); await load() }}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
