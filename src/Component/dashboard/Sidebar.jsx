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

const baseItem =
    "group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition";

export default function Sidebar({ isOpen, onClose }) {
    const { user } = useContext(AuthContext);
    if (!user) return null;

    const role = user.role;

    const linkClass = ({ isActive }) =>
        `${baseItem} ${isActive
            ? "bg-rose-50 text-rose-600"
            : "text-slate-600 hover:bg-slate-100"
        }`;

    return (
        <aside
            className={`
        fixed inset-y-0 left-0 z-50 w-64
        bg-white/80 backdrop-blur-xl
        border-r border-slate-200
        flex flex-col
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0
      `}
        >
            {/* ================= HEADER ================= */}
            <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200">
                <span className="text-xl font-bold tracking-tight text-rose-600">
                    LifeLink
                </span>

                <button
                    onClick={onClose}
                    className="lg:hidden text-slate-500 hover:text-slate-700"
                >
                    <X size={20} />
                </button>
            </div>

            {/* ================= NAV ================= */}
            <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">

                {/* MAIN */}
                <Section title="Main">
                    <NavLink to="/dashboard" end onClick={onClose} className={linkClass}>
                        <LayoutDashboard size={18} />
                        Dashboard
                        <ActiveBar />
                    </NavLink>
                </Section>

                {/* DONOR */}
                {role === "donor" && (
                    <Section title="Donor">
                        <NavLink to="/dashboard/create" onClick={onClose} className={linkClass}>
                            <PlusCircle size={18} />
                            Create Request
                            <ActiveBar />
                        </NavLink>

                        <NavLink to="/dashboard/requests" onClick={onClose} className={linkClass}>
                            <Droplet size={18} />
                            My Requests
                            <ActiveBar />
                        </NavLink>

                        <NavLink to="/dashboard/profile" onClick={onClose} className={linkClass}>
                            <User size={18} />
                            Profile
                            <ActiveBar />
                        </NavLink>
                    </Section>
                )}

                {/* VOLUNTEER */}
                {role === "volunteer" && (
                    <Section title="Volunteer">
                        <NavLink to="/dashboard/create" onClick={onClose} className={linkClass}>
                            <PlusCircle size={18} />
                            Create Request
                            <ActiveBar />
                        </NavLink>
                        <NavLink to="/dashboard/requests" onClick={onClose} className={linkClass}>
                            <Droplet size={18} />
                            My Requests
                            <ActiveBar />
                        </NavLink>
                        <NavLink
                            to="/dashboard/all-requests"
                            onClick={onClose}
                            className={linkClass}
                        >
                            <List size={18} />
                            All Requests
                            <ActiveBar />
                        </NavLink>
                        <NavLink
                            to="/dashboard/funding"
                            onClick={onClose}
                            className={linkClass}
                        >
                            <DollarSign size={18} />
                            Funding
                            <ActiveBar />
                        </NavLink>
                        <NavLink to="/dashboard/profile" onClick={onClose} className={linkClass}>
                            <User size={18} />
                            Profile
                            <ActiveBar />
                        </NavLink>
                    </Section>
                )}

                {/* ADMIN */}
                {role === "admin" && (
                    <Section title="Admin">
                        <NavLink to="/dashboard/create" onClick={onClose} className={linkClass}>
                            <PlusCircle size={18} />
                            Create Request
                            <ActiveBar />
                        </NavLink>
                        <NavLink to="/dashboard/requests" onClick={onClose} className={linkClass}>
                            <Droplet size={18} />
                            My Requests
                            <ActiveBar />
                        </NavLink>
                        <NavLink
                            to="/dashboard/all-users"
                            onClick={onClose}
                            className={linkClass}
                        >
                            <Users size={18} />
                            All Users
                            <ActiveBar />
                        </NavLink>

                        <NavLink
                            to="/dashboard/all-requests"
                            onClick={onClose}
                            className={linkClass}
                        >
                            <List size={18} />
                            All Requests
                            <ActiveBar />
                        </NavLink>

                        <NavLink
                            to="/dashboard/funding"
                            onClick={onClose}
                            className={linkClass}
                        >
                            <DollarSign size={18} />
                            Funding
                            <ActiveBar />
                        </NavLink>
                        <NavLink to="/dashboard/profile" onClick={onClose} className={linkClass}>
                            <User size={18} />
                            Profile
                            <ActiveBar />
                        </NavLink>
                    </Section>
                )}
            </nav>

            {/* ================= FOOTER ================= */}
            <div className="border-t border-slate-200 px-6 py-4 text-xs text-slate-500">
                © {new Date().getFullYear()} LifeLink
            </div>
        </aside>
    );
}

/* ================= UI HELPERS ================= */

function Section({ title, children }) {
    return (
        <div className="space-y-1">
            <p className="px-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {title}
            </p>
            {children}
        </div>
    );
}

function ActiveBar() {
    return (
        <span
            className="
        absolute left-0 top-1/2 -translate-y-1/2
        h-6 w-1 rounded-r-full
        bg-rose-600
        opacity-0 group-[.active]:opacity-100
      "
        />
    );
}
