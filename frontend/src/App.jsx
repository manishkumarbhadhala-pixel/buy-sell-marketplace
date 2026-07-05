import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductDetail from './pages/ProductDetail';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import MyProducts from './pages/MyProducts';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [search, setSearch] = useState('');

  return (
    <>
      <Navbar search={search} setSearch={setSearch} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<ProtectedRoute><Home search={search} /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
        <Route path="/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
        <Route path="/edit-product/:id" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
        <Route path="/my-products" element={<ProtectedRoute><MyProducts /></ProtectedRoute>} />
        <Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>
      </Routes>
    </>
  );
}

export default App;