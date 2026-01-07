import { useContext, useState } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

export default function DonateModal({ requestId, onClose, onSuccess }) {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const confirm = async () => {
        setLoading(true);
        await API.patch(`/donations/${requestId}/donate`);
        onSuccess();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-5">
                <h2 className="text-lg font-semibold">Confirm Donation</h2>

                <input
                    value={user.name}
                    readOnly
                    className="w-full rounded-xl bg-slate-100 px-4 py-2"
                />

                <input
                    value={user.email}
                    readOnly
                    className="w-full rounded-xl bg-slate-100 px-4 py-2"
                />

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={confirm}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl bg-rose-600 text-white"
                    >
                        {loading ? "Confirming..." : "Confirm Donation"}
                    </button>
                </div>
            </div>
        </div>
    );
}
