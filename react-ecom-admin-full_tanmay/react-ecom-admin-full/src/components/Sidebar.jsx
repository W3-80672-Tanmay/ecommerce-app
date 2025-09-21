import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Sidebar(){
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">⚡</div>
        <div>E-com Admin</div>
      </div>
      <nav className="nav">
        <NavLink to="/" end className={({isActive})=> isActive?'active':''}>🏠 Dashboard</NavLink>
        <NavLink to="/products" className={({isActive})=> isActive?'active':''}>🛒 Products</NavLink>
        <NavLink to="/categories" className={({isActive})=> isActive?'active':''}>🏷️ Categories</NavLink>
        <NavLink to="/orders" className={({isActive})=> isActive?'active':''}>📦 Orders</NavLink>
        <NavLink to="/settings" className={({isActive})=> isActive?'active':''}>⚙️ Settings</NavLink>
      </nav>
    </aside>
  )
}
