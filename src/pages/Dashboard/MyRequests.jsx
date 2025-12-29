import { useEffect, useState } from "react";
import API from "../../api/axios";
import PageLoader from "../../Component/ui/PageLoader";

const statusBadge = {
    pending: "bg-orange-100 text-orange-700",
    inprogress: "bg-blue-100 text-blue-700",
    done: "bg-green-100 text-green-700",
    canceled: "bg-red-100 text-red-700",
};

export default function MyDonationRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* ===============================
       FETCH MY REQUESTS
    ================================ */
    const loadRequests = async () => {
        try {
            const res = await API.get("/donations/my");
            setRequests(res.data || []);
        } catch {
            setError("Unable to load your donation requests.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    /* ===============================
       ACTION HANDLERS
    ================================ */
    const markDone = async (id) => {
        await API.patch(`/donations/done/${id}`);
        loadRequests();
    };

    const cancelRequest = async (id) => {
        await API.patch(`/donations/cancel/${id}`);
        loadRequests();
    };

    const deleteRequest = async (id) => {
        if (!confirm("Delete this request?")) return;
        await API.delete(`/donations/${id}`);
        loadRequests();
    };

    if (loading) return <PageLoader />;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-slate-900">
                My Donation Requests
            </h1>

            {error && (
                <div className="rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">
                    {error}
                </div>
            )}

            {requests.length === 0 ? (
                <div className="rounded-xl border bg-white p-12 text-center text-slate-500">
                    You haven’t created any donation requests yet.
                </div>
            ) : (
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
                            {requests.map((req) => (
                                <tr key={req._id} className="border-t">
                                    <td className="px-4 py-3 font-medium">
                                        {req.recipientName}
                                    </td>

                                    <td className="px-4 py-3 text-red-600 font-semibold">
                                        {req.bloodGroup}
                                    </td>

                                    <td className="px-4 py-3">
                                        {req.recipientDistrict}, {req.recipientUpazila}
                                    </td>

                                    <td className="px-4 py-3">
                                        {req.donationDate}
                                        <div className="text-xs text-slate-500">
                                            {req.donationTime}
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 capitalize">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge[req.donationStatus]
                                                }`}
                                        >
                                            {req.donationStatus}
                                        </span>
                                    </td>

                                    {/* ACTIONS */}
                                    <td className="px-4 py-3 text-right space-x-2">
                                        {req.donationStatus === "pending" && (
                                            <>
                                                <button
                                                    onClick={() =>
                                                    (window.location.href =
                                                        `/dashboard/edit-donation-request/${req._id}`)
                                                    }
                                                    className="text-blue-600 text-sm hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteRequest(req._id)}
                                                    className="text-red-600 text-sm hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}

                                        {req.donationStatus === "inprogress" && (
                                            <>
                                                <button
                                                    onClick={() => markDone(req._id)}
                                                    className="text-green-600 text-sm hover:underline"
                                                >
                                                    Done
                                                </button>
                                                <button
                                                    onClick={() => cancelRequest(req._id)}
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
            )}
        </div>
    );
}
