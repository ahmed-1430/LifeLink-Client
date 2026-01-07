/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from "react";
import API from "../../api/axios";
import PageLoader from "../../Component/ui/PageLoader";
import { AuthContext } from "../../context/AuthContext";
import {
    Shield,
    UserX,
    UserCheck,
    UserCog,
    Crown,
} from "lucide-react";

export default function AllUsers() {
    const { user: currentUser } = useContext(AuthContext);

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(null);

    /* ================= LOAD USERS ================= */
    const loadUsers = async () => {
        try {
            const res = await API.get("/admin/users");
            setUsers(res.data || []);
        } catch {
            setError("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    /* ================= ACTION HANDLER ================= */
    const runAction = async (id, fn) => {
        setActionLoading(id);
        try {
            await fn();
            await loadUsers();
        } finally {
            setActionLoading(null);
        }
    };

    const blockUser = (id) =>
        runAction(id, () => API.patch(`/admin/users/block/${id}`));
    const unblockUser = (id) =>
        runAction(id, () => API.patch(`/admin/users/unblock/${id}`));
    const makeVolunteer = (id) =>
        runAction(id, () => API.patch(`/admin/users/make-volunteer/${id}`));
    const makeAdmin = (id) => {
        if (!confirm("Promote this user to admin?")) return;
        runAction(id, () => API.patch(`/admin/users/make-admin/${id}`));
    };

    if (loading) return <PageLoader />;

    return (
        <div className="space-y-10">

            {/* ================= HEADER ================= */}
            <div className="relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl shadow-lg border border-slate-200">
                <div className="flex items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-3">
                        <Shield className="text-rose-600" size={26} />
                        <div>
                            <h1 className="text-xl font-semibold text-slate-900">
                                User Management
                            </h1>
                            <p className="text-sm text-slate-500">
                                Roles, access & platform control
                            </p>
                        </div>
                    </div>

                    <span className="rounded-full bg-slate-100 px-4 py-1 text-sm font-medium text-slate-700">
                        {users.length} users
                    </span>
                </div>
            </div>

            {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* ================= USER GRID ================= */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {users.map((u) => {
                    const isSelf = currentUser?.email === u.email;

                    return (
                        <div
                            key={u._id}
                            className="relative rounded-2xl bg-white shadow-sm border border-slate-200 p-5 transition
              hover:shadow-md hover:-translate-y-0.5"
                        >
                            {/* USER IDENTITY */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={u.avatar || "https://i.ibb.co/4pDNDk1/avatar.png"}
                                    alt={u.name}
                                    className="h-14 w-14 rounded-xl object-cover bg-slate-100"
                                />

                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-slate-900">
                                        {u.name}
                                    </p>
                                    <p className="truncate text-xs text-slate-500">
                                        {u.email}
                                    </p>
                                </div>
                            </div>

                            {/* META */}
                            <div className="mt-4 flex gap-2">
                                <Badge
                                    tone={
                                        u.role === "admin"
                                            ? "purple"
                                            : u.role === "volunteer"
                                                ? "blue"
                                                : "slate"
                                    }
                                >
                                    {u.role}
                                </Badge>

                                <Badge tone={u.status === "active" ? "green" : "red"}>
                                    {u.status}
                                </Badge>
                            </div>

                            {/* ACTIONS */}
                            <div className="mt-5 flex flex-wrap gap-2">
                                {isSelf ? (
                                    <span className="text-xs text-slate-400 italic">
                                        You can’t modify your own account
                                    </span>
                                ) : (
                                    <>
                                        {u.status === "active" ? (
                                            <Action
                                                loading={actionLoading === u._id}
                                                onClick={() => blockUser(u._id)}
                                                tone="red"
                                                icon={<UserX size={14} />}
                                            >
                                                Block
                                            </Action>
                                        ) : (
                                            <Action
                                                loading={actionLoading === u._id}
                                                onClick={() => unblockUser(u._id)}
                                                tone="green"
                                                icon={<UserCheck size={14} />}
                                            >
                                                Unblock
                                            </Action>
                                        )}

                                        {u.role === "donor" && (
                                            <Action
                                                loading={actionLoading === u._id}
                                                onClick={() => makeVolunteer(u._id)}
                                                tone="blue"
                                                icon={<UserCog size={14} />}
                                            >
                                                Volunteer
                                            </Action>
                                        )}

                                        {u.role !== "admin" && (
                                            <Action
                                                loading={actionLoading === u._id}
                                                onClick={() => makeAdmin(u._id)}
                                                tone="purple"
                                                icon={<Crown size={14} />}
                                            >
                                                Admin
                                            </Action>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {users.length === 0 && (
                <div className="rounded-xl bg-white border py-14 text-center text-slate-500">
                    No users found
                </div>
            )}
        </div>
    );
}

/* ================= UI PARTS ================= */

function Badge({ children, tone }) {
    const tones = {
        green: "bg-green-100 text-green-700",
        red: "bg-red-100 text-red-700",
        blue: "bg-blue-100 text-blue-700",
        purple: "bg-purple-100 text-purple-700",
        slate: "bg-slate-100 text-slate-700",
    };

    return (
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${tones[tone]}`}>
            {children}
        </span>
    );
}

function Action({ children, onClick, loading, tone, icon }) {
    const tones = {
        red: "bg-red-50 text-red-600 hover:bg-red-100",
        green: "bg-green-50 text-green-600 hover:bg-green-100",
        blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
        purple: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    };

    return (
        <button
            disabled={loading}
            onClick={onClick}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5
      text-xs font-semibold transition disabled:opacity-50 cursor-pointer ${tones[tone]}`}
        >
            {loading ? "…" : icon}
            {!loading && children}
        </button>
    );
}
