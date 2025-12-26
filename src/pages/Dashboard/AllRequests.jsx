import { useEffect, useState, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "../../Component/toast";

const statusStyle = {
    pending: "bg-amber-100 text-amber-700",
    inprogress: "bg-blue-100 text-blue-700",
    done: "bg-green-100 text-green-700",
    canceled: "bg-red-100 text-red-700",
};

export default function AllRequests() {
    const { user } = useContext(AuthContext);

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all");
    const [actionLoading, setActionLoading] = useState(null);

    const canUpdateStatus =
        user?.role === "admin" || user?.role === "volunteer";

    /* ---------------- LOAD REQUESTS ---------------- */
    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const res = await API.get("/all-requests");
                if (!cancelled) setRequests(res.data || []);
            } catch (err) {
                if (!cancelled)
                    setError(err.response?.data?.message || "Failed to load requests");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => (cancelled = true);
    }, []);

    /* ---------------- UPDATE STATUS (CORRECT API) ---------------- */
    const updateStatus = async (id, nextStatus) => {
        setActionLoading(id);

        try {
            if (nextStatus === "inprogress") {
                await API.patch(`/donation/accept/${id}`);
            }

            if (nextStatus === "done") {
                await API.patch(`/donation/done/${id}`);
            }

            if (nextStatus === "canceled") {
                await API.patch(`/donation/cancel/${id}`);
            }

            setRequests((prev) =>
                prev.map((r) =>
                    r._id === id ? { ...r, donationStatus: nextStatus } : r
                )
            );

            toast.success("Status updated");
        } catch (err) {
            console.error("Status update failed", err);
            toast.error("Status update failed");
        } finally {
            setActionLoading(null);
        }
    };

    const filtered =
        filter === "all"
            ? requests
            : requests.filter((r) => r.donationStatus === filter);

    if (loading) {
        return (
            <div className="py-20 text-center text-slate-500">
                Loading donation requests…
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h1 className="text-2xl font-semibold text-slate-900">
                    All Donation Requests
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
                            <th className="px-4 py-3 text-left">Blood</th>
                            <th className="px-4 py-3 text-left">Location</th>
                            <th className="px-4 py-3 text-left">Date</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            {canUpdateStatus && (
                                <th className="px-4 py-3 text-left">Action</th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((r) => (
                            <tr key={r._id} className="border-t text-slate-500">
                                <td className="px-4 py-3">{r.recipientName}</td>
                                <td className="px-4 py-3">{r.bloodGroup}</td>
                                <td className="px-4 py-3">
                                    {r.recipientDistrict}, {r.recipientUpazila}
                                </td>
                                <td className="px-4 py-3">
                                    {r.donationDate}
                                    <div className="text-xs text-slate-500">
                                        {r.donationTime}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[r.donationStatus]}`}
                                    >
                                        {r.donationStatus}
                                    </span>
                                </td>

                                {canUpdateStatus && (
                                    <td className="px-4 py-3">
                                        <select
                                            disabled={actionLoading === r._id}
                                            value={r.donationStatus}
                                            onChange={(e) =>
                                                updateStatus(r._id, e.target.value)
                                            }
                                            className="rounded-md border px-2 py-1 text-sm"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="inprogress">In Progress</option>
                                            <option value="done">Done</option>
                                            <option value="canceled">Canceled</option>
                                        </select>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
