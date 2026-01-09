import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PageLoader from "../Component/ui/PageLoader";

export default function ProtectedRoute({ roles }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <PageLoader/> ;

    if (!user) return <Navigate to="/login" replace />;

    // role-based restriction
    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
