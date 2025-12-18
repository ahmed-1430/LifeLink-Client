import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { toast } from "../../Component/toast";

const MyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const fetchRequests = async () => {
            try {
                setLoading(true);
                const res = await API.get("/my-requests");
                if (!cancelled) {
                    setRequests(res.data || []);
                }
            } catch (err) {
                console.error("Failed to fetch requests:", err);
                if (!cancelled) setError("Unable to load requests.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchRequests();

        return () => (cancelled = true);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-orange-100 text-orange-700";
            case "approved":
                return "bg-blue-100 text-blue-700";
            case "completed":
                return "bg-green-100 text-green-700";
            case "cancelled":
                return "bg-red-100 text-red-700";
            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    if (loading)
        return <div className="text-center py-20 text-slate-500">Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">My Requests</h1>

            {error && (
                <div className="text-red-600 bg-red-50 border p-3 rounded">{error}</div>
            )}

            {requests.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                    You haven't created any donation requests yet.
                </div>
            ) : (
                <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b">
                                <th className="py-3 px-4 text-sm font-medium text-slate-600">Patient</th>
                                <th className="py-3 px-4 text-sm font-medium text-slate-600">Blood</th>
                                <th className="py-3 px-4 text-sm font-medium text-slate-600">Units</th>
                                <th className="py-3 px-4 text-sm font-medium text-slate-600">Location</th>
                                <th className="py-3 px-4 text-sm font-medium text-slate-600">Status</th>
                                <th className="py-3 px-4 text-sm font-medium text-slate-600 text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {requests.map((req) => (
                                <tr key={req._id} className="border-b hover:bg-slate-50 transition">
                                    <td className="py-3 px-4">{req.patientName}</td>

                                    <td className="py-3 px-4 font-medium">{req.bloodGroup}</td>

                                    <td className="py-3 px-4">{req.unitsNeeded}</td>

                                    <td className="py-3 px-4 text-sm text-slate-600">
                                        {req.district}, {req.upazila}
                                    </td>

                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(
                                                req.status
                                            )}`}
                                        >
                                            {req.status}
                                        </span>
                                    </td>

                                    <td className="py-3 px-4 text-right">
                                        <button
                                            className="text-blue-600 hover:underline text-sm"
                                            onClick={() => toast.info("Details coming soon")}
                                        >
                                            View
                                        </button>
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
export default MyRequests;