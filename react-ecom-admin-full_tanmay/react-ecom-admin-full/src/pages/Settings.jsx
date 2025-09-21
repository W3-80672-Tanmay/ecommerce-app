import React, { useEffect, useState } from 'react'
import { getSettings, upsertSetting } from '../services/api'

export default function Settings(){
  const [items,setItems] = useState([])
  const [key,setKey] = useState('home_banner_text')
  const [value,setValue] = useState('')

  useEffect(()=>{
    (async()=>{
      try{
        const s = await getSettings()
        const arr = Array.isArray(s) ? s : Object.entries(s || {}).map(([k,v])=>({key:k,value:v}))
        setItems(arr)
      }catch(e){}
    })()
  }, [])

  const submit = async (e)=>{
    e.preventDefault()
    await upsertSetting(key, value)
    setValue('')
    alert('Updated!')
  }

  return (
    <div className="container">
      <h2 style={{marginBottom:12}}>Settings</h2>
      <div className="card" style={{marginBottom:16}}>
        <form onSubmit={submit} className="row" style={{alignItems:'end'}}>
          <div>
            <label className="label">Key</label>
            <input className="input" value={key} onChange={e=>setKey(e.target.value)} />
          </div>
          <div>
            <label className="label">Value</label>
            <input className="input" value={value} onChange={e=>setValue(e.target.value)} />
          </div>
          <div><button className="btn">Save</button></div>
        </form>
      </div>
      <div className="card">
        <h3 style={{marginTop:0}}>Current</h3>
        <ul>
          {items.map((s,i)=> <li key={i} className="muted">{s.key}: <strong style={{color:'#e5e7eb'}}>{String(s.value)}</strong></li>)}
        </ul>
      </div>
    </div>
  )
}
