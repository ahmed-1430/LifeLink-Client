import { Outlet, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../Component/dashboard/Sidebar";
import Topbar from "../component/dashboard/Topbar";

export default function DashboardLayout() {
    const { user, logout } = useContext(AuthContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-slate-100 flex overflow-hidden">

            {/* SIDEBAR (Desktop) */}
            <aside className="hidden lg:block w-64 shrink-0 border-r bg-white">
                <Sidebar role={user.role} />
            </aside>

            {/* MOBILE SIDEBAR OVERLAY */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 flex lg:hidden">
                    <div
                        className="fixed inset-0 bg-black/40"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <aside className="relative z-50 w-64 bg-white shadow-xl">
                        <Sidebar role={user.role} onClose={() => setSidebarOpen(false)} />
                    </aside>
                </div>
            )}

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* TOPBAR */}
                <Topbar
                    user={user}
                    onLogout={logout}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                {/* PAGE CONTENT */}
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
