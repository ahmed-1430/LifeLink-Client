import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function PublicLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* NAVBAR */}
            <nav className="h-16 bg-white shadow-sm border-b flex items-center justify-between px-6">
                <Link to="/" className="text-xl font-semibold">
                    LifeLink
                </Link>

                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-slate-600 hover:text-blue-600">
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Register
                    </Link>
                </div>
            </nav>

            {/* PAGE CONTENT */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* FOOTER */}
            <footer className="bg-white border-t py-4 text-center text-sm text-slate-500">
                © {new Date().getFullYear()} LifeLink — All rights reserved.
            </footer>
        </div>
    );
}
