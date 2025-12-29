/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import PageLoader from "../../Component/ui/PageLoader";

const statusStyle = {
    pending: "bg-amber-100 text-amber-700",
    inprogress: "bg-blue-100 text-blue-700",
    done: "bg-green-100 text-green-700",
    canceled: "bg-red-100 text-red-700",
};

export default function AllBloodDonationRequests() {
    const { user } = useContext(AuthContext);

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all");
    const [actionLoading, setActionLoading] = useState(null);

    /* ===============================
       LOAD REQUESTS
    ================================ */
    const loadRequests = async () => {
        try {
            const res = await API.get("/donations/all");
            setRequests(res.data || []);
        } catch (err) {
            setError("Failed to load donation requests");
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
    const acceptRequest = async (id) => {
        setActionLoading(id);
        try {
            await API.patch(`/donations/accept/${id}`);
            loadRequests();
        } finally {
            setActionLoading(null);
        }
    };

    const markDone = async (id) => {
        setActionLoading(id);
        try {
            await API.patch(`/donations/done/${id}`);
            loadRequests();
        } finally {
            setActionLoading(null);
        }
    };

    const cancelRequest = async (id) => {
        setActionLoading(id);
        try {
            await API.patch(`/donations/cancel/${id}`);
            loadRequests();
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <PageLoader />;

    const filtered =
        filter === "all"
            ? requests
            : requests.filter((r) => r.donationStatus === filter);

    const isAdmin = user?.role === "admin";
    const isVolunteer = user?.role === "volunteer";

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h1 className="text-2xl font-semibold text-slate-900">
                    All Blood Donation Requests
                </h1>

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="rounded-lg border px-3 py-2 text-sm"
                >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="inprogress">In Progress</option>
                    <option value="done">Completed</option>
                    <option value="canceled">Canceled</option>
                </select>
            </div>

            {error && (
                <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">
                    {error}
                </div>
            )}

            {/* TABLE */}
            <div className="overflow-x-auto rounded-xl border bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="px-4 py-3 text-left">Recipient</th>
                            <th className="px-4 py-3">Blood</th>
                            <th className="px-4 py-3">Location</th>
                            <th className="px-4 py-3">Date & Time</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((r) => (
                            <tr key={r._id} className="border-t">
                                <td className="px-4 py-3 font-medium">
                                    {r.recipientName}
                                </td>

                                <td className="px-4 py-3 text-red-600 font-semibold">
                                    {r.bloodGroup}
                                </td>

                                <td className="px-4 py-3">
                                    {r.recipientDistrict}, {r.recipientUpazila}
                                </td>

                                <td className="px-4 py-3">
                                    {r.donationDate}
                                    <div className="text-xs text-slate-500">
                                        {r.donationTime}
                                    </div>
                                </td>

                                <td className="px-4 py-3 capitalize">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[r.donationStatus]
                                            }`}
                                    >
                                        {r.donationStatus}
                                    </span>
                                </td>

                                {/* ACTIONS */}
                                <td className="px-4 py-3 text-right space-x-2">
                                    {r.donationStatus === "pending" &&
                                        (isAdmin || isVolunteer) && (
                                            <button
                                                disabled={actionLoading === r._id}
                                                onClick={() => acceptRequest(r._id)}
                                                className="text-blue-600 text-sm hover:underline"
                                            >
                                                Accept
                                            </button>
                                        )}

                                    {r.donationStatus === "inprogress" && isAdmin && (
                                        <>
                                            <button
                                                disabled={actionLoading === r._id}
                                                onClick={() => markDone(r._id)}
                                                className="text-green-600 text-sm hover:underline"
                                            >
                                                Done
                                            </button>
                                            <button
                                                disabled={actionLoading === r._id}
                                                onClick={() => cancelRequest(r._id)}
                                                className="text-red-600 text-sm hover:underline"
                                            >
                                                Cancel
                                            </button>
                                        </>
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
