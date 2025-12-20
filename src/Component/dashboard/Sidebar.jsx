import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Droplet,
    PlusCircle,
    List,
    Users,
    X
} from "lucide-react";
import Badge from "../ui/Badge";

const baseItem =
    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition";

export default function Sidebar({ role, onClose }) {
    return (
        <aside className="h-full w-64 bg-white border-r flex flex-col">

            {/* HEADER */}
            <div className="h-16 flex items-center justify-between px-6 border-b">
                <span className="text-xl font-semibold text-rose-600">
                    LifeLink
                </span>

                {/* Mobile Close */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="lg:hidden text-slate-500 hover:text-slate-700"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* NAV */}
            <nav className="flex-1 px-4 py-5 space-y-6 overflow-y-auto">

                {/* MAIN */}
                <div className="space-y-1">
                    <p className="px-3 text-xs font-semibold text-slate-400 uppercase">
                        Main
                    </p>

                    <NavLink
                        to="/dashboard"
                        end
                        className={({ isActive }) =>
                            `${baseItem} ${isActive
                                ? "bg-rose-50 text-rose-600"
                                : "text-slate-600 hover:bg-slate-100"
                            }`
                        }
                    >
                        <LayoutDashboard size={18} />
                        Dashboard
                    </NavLink>
                </div>

                {/* DONOR */}
                {role === "donor" && (
                    <div className="space-y-1">
                        <p className="px-3 text-xs font-semibold text-slate-400 uppercase">
                            Donation
                        </p>

                        <NavLink
                            to="/dashboard/requests"
                            className={({ isActive }) =>
                                `${baseItem} ${isActive
                                    ? "bg-rose-50 text-rose-600"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`
                            }
                        >
                            <Droplet size={18} />
                            My Requests
                        </NavLink>

                        {/* ✅ REQUIRED: ALL REQUESTS */}
                        <NavLink
                            to="/dashboard/all-requests"
                            className={({ isActive }) =>
                                `${baseItem} ${isActive
                                    ? "bg-rose-50 text-rose-600"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`
                            }
                        >
                            <List size={18} />
                            All Requests
                        </NavLink>

                        <NavLink
                            to="/dashboard/create-donation-request"
                            className={({ isActive }) =>
                                `${baseItem} ${isActive
                                    ? "bg-rose-50 text-rose-600"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`
                            }
                        >
                            <PlusCircle size={18} />
                            Create Request
                        </NavLink>
                    </div>
                )}

                {/* ADMIN */}
                {role === "admin" && (
                    <div className="space-y-1">
                        <p className="px-3 text-xs font-semibold text-slate-400 uppercase">
                            Admin
                        </p>

                        <NavLink
                            to="/admin"
                            className={({ isActive }) =>
                                `${baseItem} ${isActive
                                    ? "bg-rose-50 text-rose-600"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`
                            }
                        >
                            <Users size={18} />
                            Users
                            <Badge color="rose">Admin</Badge>
                        </NavLink>
                    </div>
                )}
            </nav>

            {/* FOOTER */}
            <div className="px-6 py-4 border-t text-xs text-slate-500">
                © {new Date().getFullYear()} LifeLink
            </div>
        </aside>
    );
}
