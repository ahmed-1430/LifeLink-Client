import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Droplet,
    PlusCircle,
    List,
    Users,
    DollarSign,
    User,
    X,
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const navItem =
    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition";

export default function Sidebar({ isOpen, onClose }) {
    const { user } = useContext(AuthContext);

    if (!user) return null;

    const role = user.role;

    return (
        <aside
            className={`
        fixed inset-y-0 left-0 z-50
        w-64 bg-white border-r
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0
      `}
        >
            {/* HEADER */}
            <div className="h-16 flex items-center justify-between px-6 border-b">
                <span className="text-xl font-semibold text-rose-600">LifeLink</span>

                {/* Close (Mobile only) */}
                <button
                    onClick={onClose}
                    className="lg:hidden text-slate-500 hover:text-slate-700"
                >
                    <X size={20} />
                </button>
            </div>

            {/* NAV */}
            <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
                {/* COMMON */}
                <div className="space-y-1">
                    <p className="px-3 text-xs font-semibold text-slate-400 uppercase">
                        Main
                    </p>

                    <NavLink
                        to="/dashboard"
                        end
                        onClick={onClose}
                        className={({ isActive }) =>
                            `${navItem} ${isActive
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
                            Donor
                        </p>

                        <NavLink
                            to="/dashboard/create-donation-request"
                            onClick={onClose}
                            className={({ isActive }) =>
                                `${navItem} ${isActive
                                    ? "bg-rose-50 text-rose-600"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`
                            }
                        >
                            <PlusCircle size={18} />
                            Create Request
                        </NavLink>

                        <NavLink
                            to="/dashboard/my-donation-requests"
                            onClick={onClose}
                            className={({ isActive }) =>
                                `${navItem} ${isActive
                                    ? "bg-rose-50 text-rose-600"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`
                            }
                        >
                            <Droplet size={18} />
                            My Requests
                        </NavLink>

                        <NavLink
                            to="/dashboard/profile"
                            onClick={onClose}
                            className={({ isActive }) =>
                                `${navItem} ${isActive
                                    ? "bg-rose-50 text-rose-600"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`
                            }
                        >
                            <User size={18} />
                            Profile
                        </NavLink>
                    </div>
                )}

                {/* VOLUNTEER */}
                {role === "volunteer" && (
                    <div className="space-y-1">
                        <p className="px-3 text-xs font-semibold text-slate-400 uppercase">
                            Volunteer
                        </p>

                        <NavLink
                            to="/dashboard/all-blood-donation-request"
                            onClick={onClose}
                            className={({ isActive }) =>
                                `${navItem} ${isActive
                                    ? "bg-rose-50 text-rose-600"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`
                            }
                        >
                            <List size={18} />
                            All Requests
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
                            to="/dashboard/all-users"
                            onClick={onClose}
                            className={({ isActive }) =>
                                `${navItem} ${isActive
                                    ? "bg-rose-50 text-rose-600"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`
                            }
                        >
                            <Users size={18} />
                            All Users
                        </NavLink>

                        <NavLink
                            to="/dashboard/all-blood-donation-request"
                            onClick={onClose}
                            className={({ isActive }) =>
                                `${navItem} ${isActive
                                    ? "bg-rose-50 text-rose-600"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`
                            }
                        >
                            <List size={18} />
                            All Requests
                        </NavLink>

                        <NavLink
                            to="/dashboard/funding"
                            onClick={onClose}
                            className={({ isActive }) =>
                                `${navItem} ${isActive
                                    ? "bg-rose-50 text-rose-600"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`
                            }
                        >
                            <DollarSign size={18} />
                            Funding
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
