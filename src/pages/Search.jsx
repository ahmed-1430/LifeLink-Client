import { useEffect, useState } from "react";
import API from "../api/axios";
import Button from "../component/ui/Button";
import Spinner from "../component/ui/Spinner";

export default function Search() {
    const [bloodGroup, setBloodGroup] = useState("");
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [district, setDistrict] = useState("");
    const [upazila, setUpazila] = useState("");

    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searched, setSearched] = useState(false);

    /* ===============================
       LOAD DISTRICTS
    ================================ */
    useEffect(() => {
        API.get("/districts")
            .then((res) => setDistricts(res.data || []))
            .catch(() => setDistricts([]));
    }, []);

    /* ===============================
       LOAD UPAZILAS
    ================================ */
    useEffect(() => {
        if (!district) {
            setUpazilas([]);
            return;
        }

        API.get(`/upazilas/${district}`)
            .then((res) => setUpazilas(res.data || []))
            .catch(() => setUpazilas([]));
    }, [district]);

    /* ===============================
       SEARCH
    ================================ */
    const searchDonors = async (e) => {
        e.preventDefault();
        setError("");
        setDonors([]);

        if (!bloodGroup || !district || !upazila) {
            setError("Please select blood group, district and upazila");
            return;
        }

        setLoading(true);
        setSearched(true);

        try {
            const res = await API.get("/donors/match", {
                params: { bloodGroup, district, upazila },
            });

            setDonors(res.data || []);
        } catch {
            setError("Failed to search donors");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-16 space-y-12">
            {/* HEADER */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900">
                    Search Blood Donors
                </h1>
                <p className="mt-2 text-slate-600">
                    Find available donors by blood group and location
                </p>
            </div>

            {/* SEARCH FORM */}
            <form
                onSubmit={searchDonors}
                className="bg-white border rounded-2xl p-8 grid gap-6 md:grid-cols-4 shadow-sm"
            >
                {/* BLOOD */}
                <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="rounded-xl border px-4 py-3 text-sm"
                >
                    <option value="">Blood Group</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                        <option key={bg}>{bg}</option>
                    ))}
                </select>

                {/* DISTRICT */}
                <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="rounded-xl border px-4 py-3 text-sm"
                >
                    <option value="">District</option>
                    {districts.map((d) => (
                        <option key={d.id} value={d.id}>
                            {d.name}
                        </option>
                    ))}
                </select>

                {/* UPAZILA */}
                <select
                    value={upazila}
                    onChange={(e) => setUpazila(e.target.value)}
                    className="rounded-xl border px-4 py-3 text-sm"
                >
                    <option value="">Upazila</option>
                    {upazilas.map((u) => (
                        <option key={u.id}>{u.name}</option>
                    ))}
                </select>

                <Button type="submit" className="rounded-xl py-3">
                    Search
                </Button>
            </form>

            {error && (
                <div className="text-center text-red-600 bg-red-50 py-3 rounded-xl">
                    {error}
                </div>
            )}

            {/* RESULTS */}
            <div className="space-y-6">
                {loading && <Spinner />}

                {!loading && searched && donors.length === 0 && (
                    <p className="text-center text-slate-500">
                        No donors found for this location.
                    </p>
                )}

                {!loading && donors.length > 0 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {donors.map((d) => (
                            <div
                                key={d._id}
                                className="bg-white border rounded-xl p-6 shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={d.avatar || "/avatar.png"}
                                        alt={d.name}
                                        className="w-12 h-12 rounded-full object-cover border"
                                    />
                                    <div>
                                        <p className="font-semibold text-slate-900">{d.name}</p>
                                        <p className="text-xs text-slate-500">{d.email}</p>
                                    </div>
                                </div>

                                <div className="mt-4 text-sm text-slate-600 space-y-1">
                                    <p>🩸 Blood Group: {d.bloodGroup}</p>
                                    <p>
                                        📍 {d.district}, {d.upazila}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
