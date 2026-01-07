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

            {/* FOOTER */}
            <footer className="bg-[#F8FAFC] border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold">
                            L
                        </span>
                        <span className="text-sm font-medium text-slate-700">
                            LifeLink
                        </span>
                    </div>

                    <p className="text-sm text-slate-500 text-center">
                        Connecting blood donors and patients when every moment matters.
                    </p>

                    <p className="text-sm text-slate-400">
                        © {new Date().getFullYear()} LifeLink
                    </p>
                </div>
            </footer>
        </div>
    );
}
