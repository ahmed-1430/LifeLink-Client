/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import PageLoader from "../../Component/ui/PageLoader";
import {
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Filter
} from "lucide-react";

const STATUS_MAP = {
    pending: "bg-amber-100 text-amber-700",
    inprogress: "bg-blue-100 text-blue-700",
    done: "bg-green-100 text-green-700",
    canceled: "bg-red-100 text-red-700",
};

const PAGE_SIZE = 6;

export default function MyDonationRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);

    /* ===============================
       LOAD DATA
    ================================ */
    const loadRequests = async () => {
        const res = await API.get("/donations/my");
        setRequests(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
    };

    useEffect(() => {
        loadRequests();
    }, []);

    /* ===============================
       ACTIONS
    ================================ */
    const markDone = async (id) => {
        await API.patch(`/donations/${id}/done`);
        loadRequests();
    };

    const cancelRequest = async (id) => {
        await API.patch(`/donations/${id}/cancel`);
        loadRequests();
    };

    const deleteRequest = async (id) => {
        if (!confirm("Delete this donation request?")) return;
        await API.delete(`/donations/${id}`);
        loadRequests();
    };

    /* ===============================
       FILTER + PAGINATION
    ================================ */
    const filtered = useMemo(() => {
        return statusFilter === "all"
            ? requests
            : requests.filter(r => r.donationStatus === statusFilter);
    }, [requests, statusFilter]);

    const paginated = filtered.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

    if (loading) return <PageLoader />;

    return (
        <div className="space-y-10">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-semibold text-slate-900">
                    My Donation Requests
                </h1>
                <p className="mt-1 text-slate-500">
                    Track and manage all your blood donation requests
                </p>
            </div>

            {/* FILTER BAR */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl bg-white/70 backdrop-blur-md shadow px-4 py-2">
                    <Filter size={16} className="text-slate-500" />
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                        className="bg-transparent text-sm focus:outline-none cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="inprogress">In Progress</option>
                        <option value="done">Done</option>
                        <option value="canceled">Canceled</option>
                    </select>
                </div>
            </div>

            {/* TABLE */}
            {filtered.length === 0 ? (
                <div className="rounded-3xl bg-white/70 backdrop-blur-md shadow p-12 text-center text-slate-500">
                    No donation requests found.
                </div>
            ) : (
                <div className="rounded-3xl bg-white/70 backdrop-blur-md shadow-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="text-slate-500 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-left">Recipient</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Blood</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginated.map((r) => (
                                <tr key={r._id} className="hover:bg-slate-50/60 transition">
                                    <td className="px-6 py-4 font-medium">
                                        {r.recipientName}
                                    </td>

                                    <td className="px-6 py-4 text-slate-600">
                                        {r.recipientDistrict}, {r.recipientUpazila}
                                    </td>

                                    <td className="px-6 py-4 text-xs text-slate-500">
                                        {r.donationDate}
                                        <div>{r.donationTime}</div>
                                    </td>

                                    <td className="px-6 py-4 font-semibold text-rose-600">
                                        {r.bloodGroup}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${STATUS_MAP[r.donationStatus]}`}>
                                            {r.donationStatus}
                                        </span>
                                    </td>

                                    {/* ACTIONS */}
                                    <td className="px-6 py-4 text-right space-x-2">
                                        {r.donationStatus === "pending" && (
                                            <>
                                                <IconBtn
                                                    icon={<Edit size={16} />}
                                                    onClick={() =>
                                                        window.location.href =
                                                        `/dashboard/edit-donation-request/${r._id}`
                                                    }
                                                />
                                                <IconBtn
                                                    icon={<Trash2 size={16} />}
                                                    color="red"
                                                    onClick={() => deleteRequest(r._id)}
                                                />
                                            </>
                                        )}

                                        {r.donationStatus === "inprogress" && (
                                            <>
                                                <IconBtn
                                                    icon={<CheckCircle size={16} />}
                                                    color="green"
                                                    onClick={() => markDone(r._id)}
                                                />
                                                <IconBtn
                                                    icon={<XCircle size={16} />}
                                                    color="red"
                                                    onClick={() => cancelRequest(r._id)}
                                                />
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100">
                            <span className="text-xs text-slate-500">
                                Page {page} of {totalPages}
                            </span>

                            <div className="space-x-2">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="px-3 py-1 rounded-lg text-sm bg-slate-100 disabled:opacity-50"
                                >
                                    Prev
                                </button>
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                    className="px-3 py-1 rounded-lg text-sm bg-slate-100 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/* ===============================
   ICON BUTTON
================================ */
function IconBtn({ icon, onClick, color = "slate" }) {
    const map = {
        slate: "text-slate-600 hover:bg-slate-100",
        green: "text-green-600 hover:bg-green-50",
        red: "text-red-600 hover:bg-red-50",
    };

    return (
        <button
            onClick={onClick}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition cursor-pointer ${map[color]}`}
        >
            {icon}
        </button>
    );
}
