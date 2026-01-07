import { Outlet, Link, NavLink, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import PageLoader from "../Component/ui/PageLoader";

export default function PublicLayout() {
    const { user, loading } = useContext(AuthContext);


    //    WAIT FOR AUTH CHECK

    if (loading) {
        return <PageLoader />;
    }


    //    REDIRECT AUTHENTICATED USERS

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
            {/* ================= NAVBAR ================= */}
            <header
                className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl shadow-[0_10px_40px_-20px_rgba(15,23,42,0.25)]"
            >
                <nav className="w-11/12 mx-auto h-16 flex items-center justify-between">

                    {/* BRAND */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div
                            className="
          h-9 w-9 rounded-xl
          bg-linear-to-br from-rose-500 to-pink-600
          text-white font-bold
          flex items-center justify-center
          shadow-[0_10px_30px_-10px_rgba(244,63,94,0.6)]
          group-hover:scale-105 transition
        "
                        >
                            L
                        </div>

                        <span className="text-lg font-semibold tracking-tight text-slate-900">
                            LifeLink
                        </span>
                    </Link>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-4">
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                `
            text-sm font-medium px-4 py-2 rounded-xl transition
            ${isActive
                                    ? "text-rose-600 bg-rose-50"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                                }
          `
                            }
                        >
                            Login
                        </NavLink>

                        <NavLink to="/register" className="text-sm font-semibold px-6 py-2.5 rounded-2xl bg-linear-to-r from-rose-500 to-pink-600 text-white shadow-[0_15px_40px_-15px_rgba(244,63,94,0.5)] hover:scale-[1.03] hover:shadow-[0_20px_50px_-15px_rgba(244,63,94,0.65)] transition">
                            Get Started
                        </NavLink>
                    </div>

                </nav>
            </header>


            {/* PAGE CONTENT */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* ================= FOOTER ================= */}
            <footer className="relative bg-white/60 backdrop-blur border-t border-slate-200">
                {/* Glow */}
                <div className="absolute inset-x-0 -top-24 h-24 bg-linear-to-r from-rose-200/30 via-transparent to-blue-200/30 blur-2xl pointer-events-none" />

                <div className="relative w-11/12  mx-auto py-14 space-y-10">

                    {/* TOP */}
                    <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">

                        {/* BRAND */}
                        <div className="text-center md:text-left max-w-sm">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                                <span className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-sm">
                                    L
                                </span>
                                <span className="text-lg font-semibold tracking-tight text-slate-900">
                                    LifeLink
                                </span>
                            </div>

                            <p className="text-sm text-slate-600 leading-relaxed">
                                Connecting blood donors, volunteers, and patients —
                                because every drop can save a life.
                            </p>
                        </div>

                        {/* LINKS */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
                            <div className="space-y-2">
                                <p className="font-semibold text-slate-800">Platform</p>
                                <ul className="space-y-1 text-slate-600">
                                    <li>
                                        <a href="/requests" className="hover:text-rose-600 transition">
                                            Donation Requests
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/search" className="hover:text-rose-600 transition">
                                            Search Donors
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/funding" className="hover:text-rose-600 transition">
                                            Funding
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <p className="font-semibold text-slate-800">Account</p>
                                <ul className="space-y-1 text-slate-600">
                                    <li>
                                        <a href="/login" className="hover:text-rose-600 transition">
                                            Login
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/register" className="hover:text-rose-600 transition">
                                            Register
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/dashboard" className="hover:text-rose-600 transition">
                                            Dashboard
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <p className="font-semibold text-slate-800">Support</p>
                                <ul className="space-y-1 text-slate-600">
                                    <li>📞 +880 1234-567890</li>
                                    <li>✉️ support@lifelink.org</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* DIVIDER */}
                    <div className="h-px bg-slate-200/70" />

                    {/* BOTTOM */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                        <p>
                            © {new Date().getFullYear()} LifeLink. All rights reserved.
                        </p>

                        <p className="text-center">
                            Built with ❤️ to save lives
                        </p>
                    </div>
                </div>
            </footer>

        </div>
    );
}
