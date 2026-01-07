import { useEffect, useState, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import PageLoader from "../../Component/ui/PageLoader";
import StripeCheckout from "../../Component/StripeCheckout";
import { toast } from "../../Component/toast";
import { Wallet, CreditCard } from "lucide-react";

export default function Funding() {
    const { user } = useContext(AuthContext);

    const [funds, setFunds] = useState([]);
    const [total, setTotal] = useState(0);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.role === "admin" || user?.role === "volunteer";

    /* ===============================
       LOAD FUNDING DATA
    ================================ */
    const loadFunds = async () => {
        try {
            const [list, totalRes] = await Promise.all([
                API.get("/funds"),
                API.get("/funds/total"),
            ]);

            setFunds(list.data || []);
            setTotal(totalRes.data?.total || 0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin) loadFunds();
        else setLoading(false);
    }, [isAdmin]);

    if (loading) return <PageLoader />;

    return (
        <div className="space-y-12">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
                        Community Funding
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Support LifeLink & help save more lives
                    </p>
                </div>

                {isAdmin && (
                    <div className="flex items-center gap-2 rounded-2xl bg-white/70 backdrop-blur-md shadow px-4 py-2">
                        <Wallet size={18} className="text-emerald-600" />
                        <span className="text-sm font-medium text-slate-700">
                            Total Collected:
                        </span>
                        <span className="font-semibold text-emerald-600">
                            ${total}
                        </span>
                    </div>
                )}
            </div>

            {/* DONATION CARD */}
            <div className="max-w-md rounded-3xl bg-white/70 backdrop-blur-md shadow-xl p-6 space-y-5">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                        <CreditCard size={22} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">
                            Donate to LifeLink
                        </h2>
                        <p className="text-sm text-slate-500">
                            Every contribution makes a difference
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">
                        Donation Amount (USD)
                    </label>
                    <input
                        type="number"
                        min="1"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5
                        focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                    />
                </div>

                {amount > 0 && (
                    <div className="pt-2">
                        <StripeCheckout
                            amount={amount}
                            onSuccess={() => {
                                setAmount("");
                                toast.success("Thank you for your support ❤️");
                                if (isAdmin) loadFunds();
                            }}
                        />
                    </div>
                )}
            </div>

            {/* ADMIN FUNDING TABLE */}
            {isAdmin && (
                <div className="rounded-3xl bg-white/70 backdrop-blur-md shadow-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100">
                        <h3 className="text-lg font-semibold">
                            Funding History
                        </h3>
                        <p className="text-xs text-slate-500">
                            Recent community contributions
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-slate-500 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3 text-left">User</th>
                                    <th className="px-6 py-3 text-left">Email</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {funds.map((f) => (
                                    <tr
                                        key={f._id}
                                        className="hover:bg-slate-50/60 transition"
                                    >
                                        <td className="px-6 py-4 font-medium">
                                            {f.userName}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {f.userEmail}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-emerald-600">
                                            ${f.amount}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">
                                            {new Date(f.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}

                                {funds.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="py-16 text-center text-slate-500"
                                        >
                                            No funding records yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
