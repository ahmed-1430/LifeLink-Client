import { useContext, useState } from "react";
import { Menu, ChevronDown, LogOut, User } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

export default function Topbar({ onMenuClick }) {
    const { user, logout } = useContext(AuthContext);
    const [open, setOpen] = useState(false);

    if (!user) return null;

    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 sm:px-6">
            {/* LEFT: Mobile Menu + Welcome */}
            <div className="flex items-center gap-3">
                {/* Mobile menu */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
                    aria-label="Open sidebar"
                >
                    <Menu size={20} />
                </button>

                <div>
                    <h1 className="text-sm sm:text-lg font-semibold text-slate-800">
                        Welcome, {user.name}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 capitalize">
                        {user.role}
                    </p>
                </div>
            </div>

            {/* RIGHT: User Menu */}
            <div className="relative">
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100"
                >
                    <img
                        src={user.avatar || "/avatar-placeholder.png"}
                        alt="avatar"
                        className="h-9 w-9 rounded-full object-cover border"
                    />
                    <ChevronDown size={16} className="text-slate-500 hidden sm:block" />
                </button>

                {/* Dropdown */}
                {open && (
                    <div
                        className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg z-50"
                        onMouseLeave={() => setOpen(false)}
                    >
                        <a
                            href="/dashboard/profile"
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100"
                        >
                            <User size={16} />
                            Profile
                        </a>

                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
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
