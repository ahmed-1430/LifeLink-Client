import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import PageLoader from "../../Component/ui/PageLoader";
import DonateModal from "./DonateModal";

export default function DonationRequestDetails() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        API.get(`/donations/${id}`)
            .then(res => setRequest(res.data))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <PageLoader />;
    if (!request) return null;

    const canDonate =
        user?.role === "donor" && request.donationStatus === "pending";

    return (
        <div className="space-y-6 max-w-4xl">
            <h1 className="text-2xl font-semibold">Donation Request Details</h1>

            {/* DETAILS */}
            <div className="bg-white rounded-2xl p-6 shadow space-y-3">
                <Detail label="Recipient">{request.recipientName}</Detail>
                <Detail label="Location">
                    {request.recipientDistrict}, {request.recipientUpazila}
                </Detail>
                <Detail label="Hospital">{request.hospitalName}</Detail>
                <Detail label="Address">{request.fullAddress}</Detail>
                <Detail label="Blood Group">{request.bloodGroup}</Detail>
                <Detail label="Date">
                    {request.donationDate} • {request.donationTime}
                </Detail>
                <Detail label="Message">{request.requestMessage}</Detail>
            </div>

            {/* DONATE BUTTON */}
            {canDonate && (
                <button
                    onClick={() => setOpen(true)}
                    className="rounded-xl bg-rose-600 px-6 py-3 text-white font-medium hover:bg-rose-700"
                >
                    Donate Blood
                </button>
            )}

            {open && (
                <DonateModal
                    requestId={id}
                    onClose={() => setOpen(false)}
                    onSuccess={() => {
                        setRequest({ ...request, donationStatus: "inprogress" });
                        setOpen(false);
                    }}
                />
            )}
        </div>
    );
}

function Detail({ label, children }) {
    return (
        <p className="text-sm">
            <span className="font-medium text-slate-600">{label}:</span>{" "}
            <span className="text-slate-800">{children}</span>
        </p>
    );
}
