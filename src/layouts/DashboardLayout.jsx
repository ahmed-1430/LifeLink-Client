import React, { useContext, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function DashboardLayout() {
    const { user, logout } = useContext(AuthContext);
    const [collapsed, setCollapsed] = useState(false);

    const menu = [
        { label: "Dashboard", path: "/dashboard", icon: "🏠" },
        { label: "My Requests", path: "/dashboard/requests", icon: "📄" },
        { label: "Create Request", path: "/dashboard/create", icon: "➕" },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* SIDEBAR */}
            <aside
                className={`${collapsed ? "w-16" : "w-64"
                    } bg-white border-r shadow-sm transition-all duration-300 flex flex-col`}
            >
                {/* Logo + Toggle */}
                <div className="h-16 border-b flex items-center justify-between px-4">
                    {!collapsed ? (
                        <div className="text-xl font-semibold">LifeLink</div>
                    ) : (
                        <div className="text-xl">💙</div>
                    )}

                    <button
                        className="text-slate-600 hover:text-slate-900"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {collapsed ? "➡️" : "⬅️"}
                    </button>
                </div>

                {/* MENU */}
                <nav className="flex-1 px-2 py-4">
                    {menu.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/dashboard"}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition 
                ${isActive
                                    ? "bg-blue-100 text-blue-700"
                                    : "text-slate-700 hover:bg-slate-100"
                                }
                `
                            }
                        >
                            <span className="text-lg">{item.icon}</span>
                            {!collapsed && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* FOOTER USER SECTION */}
                <div className="border-t p-4 flex items-center gap-3">
                    <img
                        src={user?.avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover border"
                    />
                    {!collapsed && (
                        <div className="flex-1">
                            <p className="text-sm font-medium">{user?.name}</p>
                            <button
                                onClick={logout}
                                className="text-xs text-blue-600 hover:underline mt-1"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col">
                {/* TOPBAR */}
                <header className="h-16 bg-white border-b shadow-sm px-6 flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-slate-700">
                        Welcome, {user?.name}
                    </h1>

                    <div className="flex items-center gap-3">
                        <img
                            src={user?.avatar}
                            alt="avatar"
                            className="w-10 h-10 rounded-full border"
                        />
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
