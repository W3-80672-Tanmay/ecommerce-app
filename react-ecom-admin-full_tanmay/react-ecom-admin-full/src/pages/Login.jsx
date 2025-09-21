import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '../services/api'
import { setToken } from '../utils/auth'

export default function Login(){
  const [email, setEmail] = useState(import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com')
  const [password, setPassword] = useState(import.meta.env.VITE_ADMIN_PASSWORD || 'Admin@123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const nav = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    setLoading(true); setError('')
    try{
      const res = await loginAdmin(email, password)
      if(res?.token){ setToken(res.token); nav('/') }
      else setError('Login failed')
    }catch(err){ setError(err.message) }finally{ setLoading(false) }
  }

  return (
    <div className="container" style={{display:'grid',placeItems:'center',minHeight:'calc(100vh - 40px)'}}>
      <div className="card" style={{width:420}}>
        <h2 style={{margin:'6px 0 12px'}}>Admin Login</h2>
        <form onSubmit={submit}>
          <label className="label">Email</label>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@example.com" />
          <div style={{height:10}} />
          <label className="label">Password</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
          {error && <div style={{color:'#fca5a5', marginTop:8}}>{error}</div>}
          <div style={{display:'flex',justifyContent:'flex-end', gap:10, marginTop:14}}>
            <button type="button" className="btn secondary" onClick={()=>{ setEmail(''); setPassword('') }}>Reset</button>
            <button className="btn" disabled={loading}>{loading?'Signing in...':'Sign in'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
