import { useContext, useEffect, useRef, useState } from "react";
import { Menu, ChevronDown, LogOut, User } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function Topbar({ onMenuClick }) {
    const { user, logout } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    /* Close dropdown on outside click */
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    if (!user) return null;

    return (
        <header
            className="
        sticky top-0 z-40
        h-16
        bg-white/70 backdrop-blur-xl
        border-b border-slate-200
        flex items-center justify-between
        px-4 sm:px-6
      "
        >
            {/* ================= LEFT ================= */}
            <div className="flex items-center gap-3">
                {/* Mobile menu */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition"
                    aria-label="Open sidebar"
                >
                    <Menu size={20} />
                </button>

                <div className="leading-tight">
                    <p className="text-xs text-slate-500">Welcome back</p>
                    <h1 className="text-sm sm:text-base font-semibold text-slate-900">
                        {user.name}
                    </h1>
                </div>

                {/* ROLE BADGE */}
                <span className="hidden sm:inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                    {user.role}
                </span>
            </div>

            {/* ================= RIGHT ================= */}
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-slate-100 transition cursor-pointer"
                >
                    <img
                        src={user.avatar || "/avatar-placeholder.png"}
                        alt="avatar"
                        className="h-9 w-9 rounded-full object-cover border border-slate-200"
                    />
                    <ChevronDown
                        size={16}
                        className={`hidden sm:block text-slate-500 transition-transform ${open ? "rotate-180" : ""
                            }`}
                    />
                </button>

                {/* ================= DROPDOWN ================= */}
                {open && (
                    <div
                        className="absolute right-0 mt-3 w-48 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200 shadow-xl overflow-hidden"
                    >
                        <Link
                            to="/dashboard/profile"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 transition"
                        >
                            <User size={16} />
                            Profile
                        </Link>

                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
