import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import ProductForm from './pages/ProductForm'
import Categories from './pages/Categories'
import Orders from './pages/Orders'
import Settings from './pages/Settings'
import Login from './pages/Login'
import { getToken } from './utils/auth'

function Layout({ children }){
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Header />
        <div style={{flex:1}}>{children}</div>
        <div className="footer">© {new Date().getFullYear()} E-com Admin</div>
      </div>
    </div>
  )
}

function PrivateRoute({ children }){
  const loc = useLocation()
  const token = getToken()
  if(!token){
    return <Navigate to="/login" state={{ from: loc }} replace />
  }
  return children
}

export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
      <Route path="/products" element={<PrivateRoute><Layout><Products /></Layout></PrivateRoute>} />
      <Route path="/products/:id" element={<PrivateRoute><Layout><ProductForm /></Layout></PrivateRoute>} />
      <Route path="/categories" element={<PrivateRoute><Layout><Categories /></Layout></PrivateRoute>} />
      <Route path="/orders" element={<PrivateRoute><Layout><Orders /></Layout></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Layout><Settings /></Layout></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
