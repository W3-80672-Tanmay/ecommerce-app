import React from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken, getToken } from '../utils/auth'

export default function Header(){
  const nav = useNavigate()
  const loggedIn = !!getToken()
  return (
    <div className="header">
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <strong>Admin Panel</strong>
        <span className="badge muted">API: {import.meta.env.VITE_API_BASE_URL}</span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        {loggedIn ? (
          <button className="btn secondary" onClick={()=>{ clearToken(); nav('/login') }}>Logout</button>
        ) : (
          <button className="btn" onClick={()=> nav('/login')}>Login</button>
      )}
      </div>
    </div>
  )
}
