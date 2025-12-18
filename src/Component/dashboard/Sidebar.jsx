import { NavLink } from "react-router-dom";
import { LayoutDashboard, Droplet, PlusCircle, Users } from "lucide-react";
import Badge from "../ui/Badge";

const navItem =
    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition";

export default function Sidebar({ role }) {
    return (
        <aside className="w-64 bg-white border-r flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b">
                <span className="text-xl font-semibold text-blue-600">LifeLink</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) =>
                        `${navItem} ${isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-slate-600 hover:bg-slate-100"
                        }`
                    }
                >
                    <LayoutDashboard size={18} />
                    Dashboard
                </NavLink>

                {role === "donor" && (
                    <>
                        <NavLink
                            to="/dashboard/requests"
                            className={({ isActive }) =>
                                `${navItem} ${isActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`
                            }
                        >
                            <Droplet size={18} />
                            My Requests
                        </NavLink>

                        <NavLink
                            to="/dashboard/create"
                            className={({ isActive }) =>
                                `${navItem} ${isActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`
                            }
                        >
                            <PlusCircle size={18} />
                            Create Request
                        </NavLink>
                    </>
                )}

                {role === "admin" && (
                    <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                            `${navItem} ${isActive
                                ? "bg-blue-50 text-blue-600"
                                : "text-slate-600 hover:bg-slate-100"
                            }`
                        }
                    >
                        <Users size={18} />
                        Users
                        <Badge color="blue">Admin</Badge>
                    </NavLink>
                )}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t text-xs text-slate-500">
                © {new Date().getFullYear()} LifeLink
            </div>
        </aside>
    );
}
