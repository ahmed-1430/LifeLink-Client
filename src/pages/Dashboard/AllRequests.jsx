import { useEffect, useState, useContext } from "react";
import {
    CheckCircle,
    XCircle,
    Clock,
    Droplet,
} from "lucide-react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import PageLoader from "../../Component/ui/PageLoader";

/* ===============================
   STATUS UI MAP
================================ */
const STATUS_META = {
    pending: {
        label: "Pending",
        class: "bg-amber-100 text-amber-700",
        icon: Clock,
    },
    inprogress: {
        label: "In Progress",
        class: "bg-blue-100 text-blue-700",
        icon: Droplet,
    },
    done: {
        label: "Completed",
        class: "bg-green-100 text-green-700",
        icon: CheckCircle,
    },
    canceled: {
        label: "Canceled",
        class: "bg-red-100 text-red-700",
        icon: XCircle,
    },
};

export default function AllBloodDonationRequests() {
    const { user } = useContext(AuthContext);

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [actionLoading, setActionLoading] = useState(null);

    const isAdmin = user?.role === "admin";
    const isVolunteer = user?.role === "volunteer";

    /* ===============================
       LOAD REQUESTS
    ================================ */
    const loadRequests = async () => {
        try {
            const res = await API.get("/donations");
            setRequests(res.data || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    /* ===============================
       ACTIONS
    ================================ */
    const runAction = async (id, fn) => {
        setActionLoading(id);
        try {
            await fn();
            await loadRequests();
        } finally {
            setActionLoading(null);
        }
    };

    const accept = (id) =>
        runAction(id, () => API.patch(`/donations/accept/${id}`));
    const done = (id) =>
        runAction(id, () => API.patch(`/donations/done/${id}`));
    const cancel = (id) =>
        runAction(id, () => API.patch(`/donations/cancel/${id}`));

    if (loading) return <PageLoader />;

    const filtered =
        filter === "all"
            ? requests
            : requests.filter((r) => r.donationStatus === filter);

    /* ===============================
       UI
    ================================ */
    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">
                        Blood Donation Requests
                    </h1>
                    <p className="text-sm text-slate-500">
                        Manage and monitor all donation requests
                    </p>
                </div>

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="rounded-xl border px-4 py-2 text-sm bg-white shadow-sm cursor-pointer"
                >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="inprogress">In Progress</option>
                    <option value="done">Completed</option>
                    <option value="canceled">Canceled</option>
                </select>
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden md:block rounded-2xl border bg-white shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="px-5 py-4 text-left">Recipient</th>
                            <th className="px-5 py-4">Blood</th>
                            <th className="px-5 py-4">Location</th>
                            <th className="px-5 py-4">Schedule</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((r) => {
                            const meta = STATUS_META[r.donationStatus];
                            const Icon = meta.icon;

                            return (
                                <tr
                                    key={r._id}
                                    className="border-t hover:bg-slate-50 transition"
                                >
                                    <td className="px-5 py-4 font-medium">
                                        {r.recipientName}
                                    </td>

                                    <td className="px-5 py-4 text-red-600 font-semibold">
                                        {r.bloodGroup}
                                    </td>

                                    <td className="px-5 py-4">
                                        {r.recipientDistrict}, {r.recipientUpazila}
                                    </td>

                                    <td className="px-5 py-4">
                                        {r.donationDate}
                                        <div className="text-xs text-slate-500">
                                            {r.donationTime}
                                        </div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${meta.class}`}
                                        >
                                            <Icon size={14} />
                                            {meta.label}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4 text-right space-x-2">
                                        {r.donationStatus === "pending" &&
                                            (isAdmin || isVolunteer) && (
                                                <ActionBtn
                                                    loading={actionLoading === r._id}
                                                    onClick={() => accept(r._id)}
                                                    color="blue"
                                                >
                                                    Accept
                                                </ActionBtn>
                                            )}

                                        {r.donationStatus === "inprogress" && isAdmin && (
                                            <>
                                                <ActionBtn
                                                    loading={actionLoading === r._id}
                                                    onClick={() => done(r._id)}
                                                    color="green"
                                                >
                                                    Done
                                                </ActionBtn>
                                                <ActionBtn
                                                    loading={actionLoading === r._id}
                                                    onClick={() => cancel(r._id)}
                                                    color="red"
                                                >
                                                    Cancel
                                                </ActionBtn>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}

                        {filtered.length === 0 && (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="py-10 text-center text-slate-500"
                                >
                                    No donation requests found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {filtered.map((r) => {
                    const meta = STATUS_META[r.donationStatus];
                    const Icon = meta.icon;

                    return (
                        <div
                            key={r._id}
                            className="rounded-2xl border bg-white p-5 shadow-sm space-y-3"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{r.recipientName}</p>
                                    <p className="text-sm text-slate-500">
                                        {r.recipientDistrict}, {r.recipientUpazila}
                                    </p>
                                </div>

                                <span
                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${meta.class}`}
                                >
                                    <Icon size={14} />
                                    {meta.label}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-red-600 font-semibold">
                                    {r.bloodGroup}
                                </span>
                                <span className="text-slate-500">
                                    {r.donationDate} • {r.donationTime}
                                </span>
                            </div>

                            <div className="flex gap-2 pt-2">
                                {r.donationStatus === "pending" &&
                                    (isAdmin || isVolunteer) && (
                                        <ActionBtn
                                            loading={actionLoading === r._id}
                                            onClick={() => accept(r._id)}
                                            color="blue"
                                            full
                                        >
                                            Accept
                                        </ActionBtn>
                                    )}

                                {r.donationStatus === "inprogress" && isAdmin && (
                                    <>
                                        <ActionBtn
                                            loading={actionLoading === r._id}
                                            onClick={() => done(r._id)}
                                            color="green"
                                            full
                                        >
                                            Done
                                        </ActionBtn>
                                        <ActionBtn
                                            loading={actionLoading === r._id}
                                            onClick={() => cancel(r._id)}
                                            color="red"
                                            full
                                        >
                                            Cancel
                                        </ActionBtn>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ===============================
   ACTION BUTTON
================================ */
function ActionBtn({ children, onClick, loading, color, full }) {
    const styles = {
        blue: "bg-blue-600 hover:bg-blue-700",
        green: "bg-green-600 hover:bg-green-700",
        red: "bg-red-600 hover:bg-red-700",
    };

    return (
        <button
            disabled={loading}
            onClick={onClick}
            className={`px-4 py-2 rounded-xl text-sm font-medium text-white shadow-sm transition cursor-pointer
        ${styles[color]}
        ${full ? "flex-1" : ""}
        disabled:opacity-50`}
        >
            {loading ? "..." : children}
        </button>
    );
}
