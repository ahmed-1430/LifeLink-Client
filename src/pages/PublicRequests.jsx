import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Spinner from "../component/ui/Spinner";

export default function PublicRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* ===============================
       LOAD PUBLIC REQUESTS
    ================================ */
    useEffect(() => {
        const load = async () => {
            try {
                const res = await API.get("/donations/all");

                const pendingOnly = (res.data || []).filter(
                    (r) => r.donationStatus === "pending"
                );

                setRequests(pendingOnly);
            } catch {
                setError("Failed to load donation requests");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    if (loading) {
        return (
            <div className="py-20 flex justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-16 space-y-10">
            {/* HEADER */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900">
                    Blood Donation Requests
                </h1>
                <p className="mt-2 text-slate-600">
                    Current blood requests from hospitals and patients
                </p>
            </div>

            {error && (
                <div className="text-center text-red-600 bg-red-50 py-3 rounded-xl">
                    {error}
                </div>
            )}

            {/* LIST */}
            {requests.length === 0 ? (
                <div className="text-center text-slate-500">
                    No active blood requests at the moment.
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map((r) => (
                        <div
                            key={r._id}
                            className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                    {r.recipientName}
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    {r.hospitalName}
                                </p>

                                <div className="mt-4 text-sm text-slate-600 space-y-1">
                                    <p>🩸 Blood Group: {r.bloodGroup}</p>
                                    <p>
                                        📍 {r.recipientDistrict}, {r.recipientUpazila}
                                    </p>
                                    <p>
                                        🗓 {r.donationDate} at {r.donationTime}
                                    </p>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="mt-6">
                                <Link
                                    to="/login"
                                    className="block text-center rounded-xl bg-rose-600 text-white py-2.5 text-sm font-medium hover:bg-rose-700 transition"
                                >
                                    Login to Respond
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
