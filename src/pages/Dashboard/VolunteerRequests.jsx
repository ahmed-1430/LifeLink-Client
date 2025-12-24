import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function VolunteerRequests() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        API.get("/volunteer/requests")
            .then(res => setRequests(res.data || []));
    }, []);

    const acceptRequest = async (id) => {
        await API.patch(`/donation/${id}/accept`);
        setRequests(r => r.filter(req => req._id !== id));
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Pending Donation Requests</h1>

            {requests.map(req => (
                <div key={req._id} className="border rounded-xl p-4 bg-white">
                    <p className="font-medium">{req.recipientName}</p>
                    <p className="text-sm text-slate-600">
                        {req.bloodGroup} • {req.recipientDistrict}
                    </p>

                    <button
                        onClick={() => acceptRequest(req._id)}
                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Accept Request
                    </button>
                </div>
            ))}
        </div>
    );
}
