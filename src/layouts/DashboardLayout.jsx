import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

export default function DashboardLayout() {
    const { user, logout } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen flex bg-slate-100">
            {/* Sidebar */}
            <Sidebar role={user.role} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <Topbar user={user} onLogout={logout} />

                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
