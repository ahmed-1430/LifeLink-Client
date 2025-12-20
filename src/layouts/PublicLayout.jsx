import React from "react";
import { Outlet, Link, NavLink } from "react-router-dom";

export default function PublicLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC]">

            {/* NAVBAR */}
            <header className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-slate-200">
                <nav className="w-11/12 mx-auto h-16 flex items-center justify-between">

                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold">
                            L
                        </span>
                        <span className="text-lg font-semibold tracking-tight text-slate-900">
                            LifeLink
                        </span>
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                `text-sm px-4 py-2 rounded-lg transition ${isActive
                                    ? "text-rose-600"
                                    : "text-slate-600 hover:text-slate-900"
                                }`
                            }
                        >
                            Login
                        </NavLink>

                        <NavLink
                            to="/register"
                            className="text-sm px-5 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 shadow-md transition"
                        >
                            Get Started
                        </NavLink>
                    </div>

                </nav>
            </header>

            {/* PAGE CONTENT */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* FOOTER */}
            <footer className="bg-[#F8FAFC] border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">

                    {/* Left: Brand */}
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold">
                            L
                        </span>
                        <span className="text-sm font-medium text-slate-700">
                            LifeLink
                        </span>
                    </div>

                    {/* Center: Message */}
                    <p className="text-sm text-slate-500 text-center">
                        Connecting blood donors and patients when every moment matters.
                    </p>

                    {/* Right: Legal */}
                    <p className="text-sm text-slate-400">
                        © {new Date().getFullYear()} LifeLink
                    </p>

                </div>
            </footer>
        </div>
    );
}
