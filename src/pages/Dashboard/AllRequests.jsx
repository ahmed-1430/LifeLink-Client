import { useEffect, useState } from "react";
import API from "../../api/axios";

const statusStyle = {
    pending: "bg-amber-100 text-amber-700",
    accepted: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

export default function AllRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const res = await API.get("/requests"); // must exist in backend
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
                <p className="text-sm text-slate-500">
                    Browse current blood donation needs
                </p>
            </div>

            {error && (
                <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">
                    {error}
                </div>
            )}

            {requests.length === 0 ? (
                <div className="rounded-xl border bg-white p-10 text-center text-slate-500">
                    No donation requests found.
                </div>
            ) : (
                <>
                    {/* MOBILE VIEW (CARDS) */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {requests.map((r) => (
                            <div
                                key={r._id}
                                className="rounded-xl border bg-white p-4 space-y-3"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium">{r.recipientName}</p>
                                        <p className="text-sm text-slate-500">
                                            {r.hospital}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[r.status] || "bg-slate-100 text-slate-600"
                                            }`}
                                    >
                                        {r.status}
                                    </span>
                                </div>

                                <div className="text-sm text-slate-600">
                                    🩸 {r.bloodGroup} • 📍 {r.district}, {r.upazila}
                                </div>

                                <div className="text-xs text-slate-500">
                                    {r.donationDate} at {r.donationTime}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* DESKTOP VIEW (TABLE) */}
                    <div className="hidden md:block overflow-x-auto rounded-xl border bg-white">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Recipient</th>
                                    <th className="px-4 py-3 text-left font-medium">Blood</th>
                                    <th className="px-4 py-3 text-left font-medium">Location</th>
                                    <th className="px-4 py-3 text-left font-medium">Date</th>
                                    <th className="px-4 py-3 text-left font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((r) => (
                                    <tr
                                        key={r._id}
                                        className="border-t hover:bg-slate-50 transition"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="font-medium">{r.recipientName}</div>
                                            <div className="text-xs text-slate-500">
                                                {r.hospital}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">{r.bloodGroup}</td>
                                        <td className="px-4 py-3">
                                            {r.district}, {r.upazila}
                                        </td>
                                        <td className="px-4 py-3">
                                            {r.donationDate} <br />
                                            <span className="text-xs text-slate-500">
                                                {r.donationTime}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[r.status] ||
                                                    "bg-slate-100 text-slate-600"
                                                    }`}
                                            >
                                                {r.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
