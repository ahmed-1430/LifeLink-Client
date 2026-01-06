import { useEffect, useState, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import PageLoader from "../../Component/ui/PageLoader";
import StripeCheckout from "../../Component/StripeCheckout";
import { toast } from "../../Component/toast";

export default function Funding() {
    const { user } = useContext(AuthContext);

    const [funds, setFunds] = useState([]);
    const [total, setTotal] = useState(0);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.role === "admin" || user?.role === "volunteer";

    const loadFunds = async () => {
        const [list, totalRes] = await Promise.all([
            API.get("/funds"),
            API.get("/funds/total"),
        ]);
        setFunds(list.data || []);
        setTotal(totalRes.data?.total || 0);
        setLoading(false);
    };

    useEffect(() => {
        if (isAdmin) loadFunds();
        else setLoading(false);
    }, [isAdmin]);

    if (loading) return <PageLoader />;

    return (
        <div className="space-y-8">
            <div className="flex justify-between">
                <h1 className="text-2xl font-semibold">Community Funding</h1>
                {isAdmin && <span>Total: ${total}</span>}
            </div>

            {/* DONATE */}
            <div className="bg-white rounded-2xl border shadow p-6 max-w-md">
                <h2 className="font-semibold mb-3">Donate to LifeLink</h2>

                <input
                    type="number"
                    placeholder="Amount (USD)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border rounded-xl px-4 py-2 mb-4"
                />

                {amount > 0 && (
                    <StripeCheckout
                        amount={amount}
                        onSuccess={() => {
                            setAmount("");
                            toast.success("Payment successful ❤️");
                            if (isAdmin) loadFunds();
                        }}
                    />
                )}
            </div>

            {/* ADMIN TABLE */}
            {isAdmin && (
                <div className="bg-white rounded-xl border overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-2 text-left">User</th>
                                <th>Email</th>
                                <th>Amount</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {funds.map((f) => (
                                <tr key={f._id} className="border-t">
                                    <td className="px-4 py-2">{f.userName}</td>
                                    <td>{f.userEmail}</td>
                                    <td className="text-green-600">${f.amount}</td>
                                    <td>{new Date(f.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
