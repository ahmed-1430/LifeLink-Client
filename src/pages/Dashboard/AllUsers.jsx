/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from "react";
import API from "../../api/axios";
import PageLoader from "../../Component/ui/PageLoader";
import { AuthContext } from "../../context/AuthContext";
import {
    Shield,
    UserCog,
    UserX,
    UserCheck,
    Crown,
} from "lucide-react";

export default function AllUsers() {
    const { user: currentUser } = useContext(AuthContext);

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(null);

    /* ===============================
       LOAD USERS
    ================================ */
    const loadUsers = async () => {
        try {
            const res = await API.get("/admin/users");
            setUsers(res.data || []);
        } catch (err) {
            setError("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    /* ===============================
       ACTION WRAPPER
    ================================ */
    const runAction = async (id, fn) => {
        setActionLoading(id);
        try {
            await fn();
            await loadUsers();
        } catch (err) {
            console.error("Admin action failed", err);
        } finally {
            setActionLoading(null);
        }
    };

    /* ===============================
       ADMIN ACTIONS (CORRECT PATHS)
    ================================ */
    const blockUser = (id) =>
        runAction(id, () => API.patch(`/admin/users/block/${id}`));

    const unblockUser = (id) =>
        runAction(id, () => API.patch(`/admin/users/unblock/${id}`));

    const makeVolunteer = (id) =>
        runAction(id, () => API.patch(`/admin/users/make-volunteer/${id}`));

    const makeAdmin = (id) => {
        if (!window.confirm("Are you sure you want to make this user an admin?"))
            return;
        runAction(id, () => API.patch(`/admin/users/make-admin/${id}`));
    };


    if (loading) return <PageLoader />;

    return (
        <div className="space-y-8">
            {/* ================= HEADER ================= */}
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-rose-600 to-pink-600 p-6 text-white shadow-xl">
                <div className="flex items-center gap-3">
                    <Shield size={28} />
                    <div>
                        <h1 className="text-2xl font-bold">Admin · User Management</h1>
                        <p className="text-sm opacity-90">
                            Control users, roles, and platform access
                        </p>
                    </div>
                </div>

                <span className="absolute right-6 top-6 rounded-full bg-white/20 px-4 py-1 text-sm">
                    {users.length} users
                </span>
            </div>

            {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* ================= USERS GRID ================= */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {users.map((u) => {
                    const isSelf = currentUser?.email === u.email;

                    return (
                        <div
                            key={u._id}
                            className="group relative rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                        >
                            {/* USER INFO */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={u.avatar || "https://i.ibb.co/4pDNDk1/avatar.png"}
                                    alt={u.name}
                                    className="h-14 w-14 rounded-full border object-cover"
                                />

                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-slate-800">
                                        {u.name}
                                    </p>
                                    <p className="truncate text-xs text-slate-500">
                                        {u.email}
                                    </p>
                                </div>
                            </div>

                            {/* BADGES */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                <Badge
                                    color={
                                        u.role === "admin"
                                            ? "purple"
                                            : u.role === "volunteer"
                                                ? "blue"
                                                : "slate"
                                    }
                                >
                                    {u.role}
                                </Badge>

                                <Badge color={u.status === "active" ? "green" : "red"}>
                                    {u.status}
                                </Badge>
                            </div>

                            {/* ACTIONS */}
                            <div className="mt-5 flex flex-wrap gap-2">
                                {!isSelf ? (
                                    <>
                                        {u.status === "active" ? (
                                            <ActionButton
                                                loading={actionLoading === u._id}
                                                color="red"
                                                icon={<UserX size={14} />}
                                                onClick={() => blockUser(u._id)}
                                            >
                                                Block
                                            </ActionButton>
                                        ) : (
                                            <ActionButton
                                                loading={actionLoading === u._id}
                                                color="green"
                                                icon={<UserCheck size={14} />}
                                                onClick={() => unblockUser(u._id)}
                                            >
                                                Unblock
                                            </ActionButton>
                                        )}

                                        {u.role === "donor" && (
                                            <ActionButton
                                                loading={actionLoading === u._id}
                                                color="blue"
                                                icon={<UserCog size={14} />}
                                                onClick={() => makeVolunteer(u._id)}
                                            >
                                                Volunteer
                                            </ActionButton>
                                        )}

                                        {u.role !== "admin" && (
                                            <ActionButton
                                                loading={actionLoading === u._id}
                                                color="purple"
                                                icon={<Crown size={14} />}
                                                onClick={() => makeAdmin(u._id)}
                                            >
                                                Admin
                                            </ActionButton>
                                        )}
                                    </>
                                ) : (
                                    <span className="text-xs italic text-slate-400">
                                        This is you
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {users.length === 0 && (
                <div className="rounded-xl border bg-white py-12 text-center text-slate-500">
                    No users found
                </div>
            )}
        </div>
    );
}

/* ===============================
   UI COMPONENTS
================================ */

function Badge({ children, color }) {
    const colors = {
        green: "bg-green-100 text-green-700",
        red: "bg-red-100 text-red-700",
        blue: "bg-blue-100 text-blue-700",
        purple: "bg-purple-100 text-purple-700",
        slate: "bg-slate-100 text-slate-700",
    };

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${colors[color]}`}
        >
            {children}
        </span>
    );
}

function ActionButton({ children, onClick, loading, color, icon }) {
    const colors = {
        red: "bg-red-50 text-red-600 hover:bg-red-100",
        green: "bg-green-50 text-green-600 hover:bg-green-100",
        blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
        purple: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    };

    return (
        <button
            disabled={loading}
            onClick={onClick}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition
        ${colors[color]} disabled:opacity-50`}
        >
            {loading ? "..." : icon}
            {!loading && children}
        </button>
    );
}
