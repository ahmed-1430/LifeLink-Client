import { useEffect, useState, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import PageLoader from "../../Component/ui/PageLoader";

export default function Funding() {
    const { user } = useContext(AuthContext);

    const [funds, setFunds] = useState([]);
    const [total, setTotal] = useState(0);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState("");

    const isAdmin = user?.role === "admin" || user?.role === "volunteer";

    /* ===============================
       LOAD FUNDS
    ================================ */
    const loadFunds = async () => {
        try {
            const [listRes, totalRes] = await Promise.all([
                API.get("/funds"),
                API.get("/funds/total"),
            ]);

            setFunds(listRes.data || []);
            setTotal(totalRes.data?.total || 0);
        } catch (err) {
            console.error(err);
            setError("Failed to load funding data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin) loadFunds();
        else setLoading(false);
    }, [isAdmin]);

    /* ===============================
       MOCK DONATE (RECORD ONLY)
    ================================ */
    const donate = async () => {
        if (!amount || amount <= 0) return;

        setPaying(true);
        setError("");

        try {
            // 1️⃣ create payment intent
            const intentRes = await API.post("/funds/create-intent", {
                amount: Number(amount),
            });

            // 2️⃣ save funding record
            await API.post("/funds", {
                amount: Number(amount),
                paymentId: intentRes.data.clientSecret,
            });

            setAmount("");
            if (isAdmin) loadFunds();
            alert("Thank you for your contribution ❤️");
        } catch (err) {
            console.error(err);
            setError("Donation failed");
        } finally {
            setPaying(false);
        }
    };

    if (loading) return <PageLoader />;

    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-slate-900">
                    Community Funding
                </h1>
                {isAdmin && (
                    <span className="text-sm text-slate-500">
                        Total collected: <b>${total}</b>
                    </span>
                )}
            </div>

            {/* DONATE CARD */}
            <div className="bg-white rounded-2xl border shadow p-6 max-w-md">
                <h2 className="text-lg font-semibold mb-2">Support LifeLink</h2>
                <p className="text-sm text-slate-500 mb-4">
                    Your contribution helps manage blood donation logistics and volunteers.
                </p>

                <input
                    type="number"
                    placeholder="Enter amount (USD)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border rounded-xl px-4 py-2 mb-3"
                />

                {error && (
                    <p className="text-sm text-red-600 mb-2">{error}</p>
                )}

                <button
                    disabled={paying}
                    onClick={donate}
                    className="w-full rounded-xl bg-rose-600 text-white py-2 font-medium hover:bg-rose-700 disabled:opacity-50"
                >
                    {paying ? "Processing..." : "Donate"}
                </button>
            </div>

            {/* ADMIN TABLE */}
            {isAdmin && (
                <div className="bg-white rounded-2xl border shadow overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="px-4 py-3 text-left">User</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {funds.map((f) => (
                                <tr key={f._id} className="border-t">
                                    <td className="px-4 py-3 font-medium">{f.userName}</td>
                                    <td className="px-4 py-3">{f.userEmail}</td>
                                    <td className="px-4 py-3 font-semibold text-green-600">
                                        ${f.amount}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-500">
                                        {new Date(f.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}

                            {funds.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="py-6 text-center text-slate-500">
                                        No funding records yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
