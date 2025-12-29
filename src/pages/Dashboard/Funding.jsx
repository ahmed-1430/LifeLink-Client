/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import API from "../../api/axios";
import PageLoader from "../../Component/ui/PageLoader";

export default function Funding() {
    const [funds, setFunds] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* ===============================
       LOAD FUNDS
    ================================ */
    const loadFunds = async () => {
        try {
            const [fundRes, totalRes] = await Promise.all([
                API.get("/funds"),
                API.get("/funds/total"),
            ]);

            setFunds(fundRes.data || []);
            setTotal(totalRes.data?.totalFunds || 0);
        } catch (err) {
            setError("Failed to load funding data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFunds();
    }, []);

    if (loading) return <PageLoader />;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-slate-900">
                Funding Overview
            </h1>

            {error && (
                <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">
                    {error}
                </div>
            )}

            {/* TOTAL FUNDS */}
            <div className="bg-white border rounded-xl p-6 shadow-sm">
                <p className="text-sm text-slate-500">Total Funds Collected</p>
                <h2 className="text-3xl font-bold text-emerald-600 mt-1">
                    ${total.toLocaleString()}
                </h2>
            </div>

            {/* FUND TABLE */}
            <div className="overflow-x-auto rounded-xl border bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="px-4 py-3 text-left">Donor</th>
                            <th className="px-4 py-3 text-left">Email</th>
                            <th className="px-4 py-3 text-left">Amount</th>
                            <th className="px-4 py-3 text-left">Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {funds.map((f) => (
                            <tr key={f._id} className="border-t text-slate-600">
                                <td className="px-4 py-3 font-medium">{f.userName}</td>
                                <td className="px-4 py-3">{f.userEmail}</td>
                                <td className="px-4 py-3 font-semibold text-emerald-600">
                                    ${f.amount}
                                </td>
                                <td className="px-4 py-3">
                                    {new Date(f.date).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {funds.length === 0 && (
                    <div className="p-10 text-center text-slate-500">
                        No funding records found.
                    </div>
                )}
            </div>
        </div>
    );
}
