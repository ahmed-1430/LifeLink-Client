import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import Spinner from "../Component/ui/Spinner";

export default function RequestDetails() {
    const { id } = useParams();

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* ===============================
       LOAD REQUEST DETAILS
    ================================ */
    useEffect(() => {
        const load = async () => {
            try {
                const res = await API.get("/donations/all");

                const found = (res.data || []).find((r) => r._id === id);

                if (!found) {
                    setError("Request not found");
                } else {
                    setRequest(found);
                }
            } catch {
                setError("Failed to load request details");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    if (loading) {
        return (
            <div className="py-20 flex justify-center">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-xl mx-auto py-20 text-center">
                <p className="text-red-600">{error}</p>
                <Link
                    to="/requests"
                    className="mt-6 inline-block text-rose-600 hover:underline"
                >
                    ← Back to requests
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">
            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">
                    Blood Donation Request
                </h1>
                <p className="mt-2 text-slate-600">
                    Detailed information about this blood request
                </p>
            </div>

            {/* DETAILS CARD */}
            <div className="bg-white border rounded-2xl p-8 shadow-sm space-y-6">
                <div>
                    <p className="text-sm text-slate-500">Recipient</p>
                    <p className="text-lg font-semibold">{request.recipientName}</p>
                </div>

                <div>
                    <p className="text-sm text-slate-500">Blood Group</p>
                    <p className="text-lg font-semibold text-red-600">
                        {request.bloodGroup}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-slate-500">Hospital</p>
                    <p className="text-base">{request.hospitalName}</p>
                </div>

                <div>
                    <p className="text-sm text-slate-500">Location</p>
                    <p className="text-base">
                        {request.recipientDistrict}, {request.recipientUpazila}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-slate-500">Donation Date & Time</p>
                    <p className="text-base">
                        {request.donationDate} at {request.donationTime}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-slate-500">Request Message</p>
                    <p className="text-base text-slate-700">
                        {request.requestMessage}
                    </p>
                </div>
            </div>

            {/* CTA */}
            <div className="text-center">
                <Link
                    to="/login"
                    className="inline-block rounded-xl bg-rose-600 text-white px-10 py-3 font-medium hover:bg-rose-700 transition"
                >
                    Login to Respond
                </Link>
            </div>
        </div>
    );
}
