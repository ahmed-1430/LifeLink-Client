import { useEffect, useState } from "react";
import API from "../../api/axios";
import PageLoader from "../../Component/ui/PageLoader";

export default function AllUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(null);

    /* ===============================
       LOAD USERS
    ================================ */
    const loadUsers = async () => {
        try {
            const res = await API.get("/users");
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
       ACTIONS
    ================================ */
    const blockUser = async (id) => {
        setActionLoading(id);
        try {
            await API.patch(`/users/block/${id}`);
            loadUsers();
        } finally {
            setActionLoading(null);
        }
    };

    const unblockUser = async (id) => {
        setActionLoading(id);
        try {
            await API.patch(`/users/unblock/${id}`);
            loadUsers();
        } finally {
            setActionLoading(null);
        }
    };

    const makeVolunteer = async (id) => {
        setActionLoading(id);
        try {
            await API.patch(`/users/make-volunteer/${id}`);
            loadUsers();
        } finally {
            setActionLoading(null);
        }
    };

    const makeAdmin = async (id) => {
        if (!confirm("Are you sure you want to make this user an admin?")) return;

        setActionLoading(id);
        try {
            await API.patch(`/users/make-admin/${id}`);
            loadUsers();
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <PageLoader />;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-slate-900">All Users</h1>

            {error && (
                <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto rounded-xl border bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-left">Email</th>
                            <th className="px-4 py-3 text-left">Role</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id} className="border-t text-slate-600">
                                <td className="px-4 py-3 font-medium">{u.name}</td>
                                <td className="px-4 py-3">{u.email}</td>

                                <td className="px-4 py-3 capitalize">
                                    <span className="px-2 py-1 rounded-md bg-slate-100 text-xs">
                                        {u.role}
                                    </span>
                                </td>

                                <td className="px-4 py-3 capitalize">
                                    <span
                                        className={`px-2 py-1 rounded-md text-xs font-medium ${u.status === "active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {u.status}
                                    </span>
                                </td>

                                {/* ACTIONS */}
                                <td className="px-4 py-3 text-right space-x-2">
                                    {u.status === "active" ? (
                                        <button
                                            disabled={actionLoading === u._id}
                                            onClick={() => blockUser(u._id)}
                                            className="text-red-600 text-sm hover:underline"
                                        >
                                            Block
                                        </button>
                                    ) : (
                                        <button
                                            disabled={actionLoading === u._id}
                                            onClick={() => unblockUser(u._id)}
                                            className="text-green-600 text-sm hover:underline"
                                        >
                                            Unblock
                                        </button>
                                    )}

                                    {u.role === "donor" && (
                                        <button
                                            disabled={actionLoading === u._id}
                                            onClick={() => makeVolunteer(u._id)}
                                            className="text-blue-600 text-sm hover:underline"
                                        >
                                            Make Volunteer
                                        </button>
                                    )}

                                    {u.role !== "admin" && (
                                        <button
                                            disabled={actionLoading === u._id}
                                            onClick={() => makeAdmin(u._id)}
                                            className="text-purple-600 text-sm hover:underline"
                                        >
                                            Make Admin
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
