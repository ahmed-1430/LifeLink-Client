import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Spinner from "../../Component/ui/Spinner";

const statusBadge = {
    pending: "bg-orange-100 text-orange-700",
    accepted: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

export default function MyRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const res = await API.get("/my-requests");
                if (!cancelled) setRequests(res.data || []);
            } catch (err) {
                if (!cancelled)
                    setError("Unable to load your donation requests.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => (cancelled = true);
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex content-center"> <Spinner /> </div>
        );
    }
    console.log(requests);

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
                <>
                    {/* MOBILE VIEW */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {requests.map((req) => (
                            <div
                                key={req._id}
                                className="rounded-xl border bg-white p-4 space-y-3"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium text-slate-600">{req.recipientName}</p>
                                        <p className="text-sm text-slate-600">
                                            {req.hospitalName}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge[req.donationStatus]
                                            }`}
                                    >
                                        {req.donationStatus}
                                    </span>
                                </div>

                                <div className="text-sm text-slate-600">
                                    🩸 {req.bloodGroup}
                                </div>

                                <div className="text-xs text-slate-500">
                                    📍 {req.recipientDistrict}, {req.recipientUpazila}
                                </div>

                                <div className="text-xs text-slate-500">
                                    🗓 {req.donationDate} at {req.donationTime}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* DESKTOP VIEW */}
                    <div className="hidden md:block overflow-x-auto rounded-xl border bg-white">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    <th className="px-4 py-3 text-left">Recipient</th>
                                    <th className="px-4 py-3 text-left">Blood</th>
                                    <th className="px-4 py-3 text-left">Hospital</th>
                                    <th className="px-4 py-3 text-left">Location</th>
                                    <th className="px-4 py-3 text-left">Date</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {requests.map((req) => (
                                    <tr
                                        key={req._id}
                                        className="border-t hover:bg-slate-50 transition text-slate-500"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {req.recipientName}
                                        </td>
                                        <td className="px-4 py-3 text-red-500 font-semibold">{req.bloodGroup}</td>
                                        <td className="px-4 py-3">{req.hospitalName}</td>
                                        <td className="px-4 py-3">
                                            {req.recipientDistrict}, {req.recipientUpazila}
                                        </td>
                                        <td className="px-4 py-3">
                                            {req.donationDate}
                                            <div className="text-xs text-slate-500">
                                                {req.donationTime}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge[req.donationStatus]
                                                    }`}
                                            >
                                                {req.donationStatus}
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
