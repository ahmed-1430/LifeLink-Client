import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';


export default function App() {
  return (
    <Routes>
      <Route path='/' element={<h1>Home</h1>} />
      <Route path='/login' element={<h1>Login</h1>} />
      <Route path='/register' element={<h1>Register</h1>} />


      <Route element={<ProtectedRoute />}>
        <Route path='/dashboard' element={<h1>dashboard Layout</h1>} />
      </Route>


      {/* Example admin-only nested route */}
      <Route element={<ProtectedRoute roles={["admin"]} />}>
        <Route path='/admin' element={<div>Admin area</div>} />
      </Route>
    </Routes>
  );
}