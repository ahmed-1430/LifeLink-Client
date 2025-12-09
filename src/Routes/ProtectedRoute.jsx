import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router';
import { AuthContext } from '../context/AuthContext';


const ProtectedRoute = ({ roles }) => {
    const { user } = useContext(AuthContext);


    if (!user) return <Navigate to="/login" replace />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;


    return <Outlet />; // child render here
};


export default ProtectedRoute;