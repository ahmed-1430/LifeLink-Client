import { useEffect, useState } from "react";
import API from "../api/axios";
import Button from "../Component/ui/Button";
import Spinner from "../Component/ui/Spinner";
import { Search as SearchIcon, Droplet, MapPin } from "lucide-react";

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

    /* ================= LOAD DISTRICTS ================= */
    useEffect(() => {
        API.get("/geo/districts")
            .then((res) => setDistricts(res.data || []))
            .catch(() => setDistricts([]));
    }, []);

    /* ================= LOAD UPAZILAS ================= */
    useEffect(() => {
        if (!district) {
            setUpazilas([]);
            return;
        }

        API.get(`/geo/upazilas/${district}`)
            .then((res) => setUpazilas(res.data || []))
            .catch(() => setUpazilas([]));
    }, [district]);

    /* ================= SEARCH ================= */
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
        <div className="w-11/12 mx-auto py-20 space-y-14">

            {/* ================= HEADER ================= */}
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                    Find Blood Donors
                </h1>
                <p className="mt-3 text-slate-600">
                    Search verified donors by blood group and location
                </p>
            </div>

            {/* ================= SEARCH FORM ================= */}
            <form
                onSubmit={searchDonors}
                className="
          relative
          bg-white/70 backdrop-blur-xl
          rounded-3xl
          shadow-[0_20px_60px_-30px_rgba(15,23,42,0.3)]
          p-8
          grid gap-6 md:grid-cols-4
        "
            >
                {/* BLOOD GROUP */}
                <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="rounded-2xl bg-white px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-rose-500 outline-none cursor-pointer"
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
                    className="rounded-2xl bg-white px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-rose-500 outline-none cursor-pointer"
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
                    className="rounded-2xl bg-white px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-rose-500 outline-none cursor-pointer"
                >
                    <option value="">Upazila</option>
                    {upazilas.map((u) => (
                        <option key={u.id}>{u.name}</option>
                    ))}
                </select>

                {/* BUTTON */}
                <Button
                    type="submit"
                    className="rounded-2xl py-3 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                    <SearchIcon size={18} />
                    Search
                </Button>
            </form>

            {/* ================= ERROR ================= */}
            {error && (
                <div className="text-center text-red-600 bg-red-50 py-3 rounded-xl">
                    {error}
                </div>
            )}

            {/* ================= RESULTS ================= */}
            <div className="space-y-8">
                {loading && <Spinner />}

                {!loading && searched && donors.length === 0 && (
                    <p className="text-center text-slate-500">
                        No donors found for this location.
                    </p>
                )}

                {!loading && donors.length > 0 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {donors.map((d) => (
                            <div key={d._id} className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-[0_15px_40px_-25px_rgba(15,23,42,0.25)] hover:-translate-y-1 hover:shadow-[0_25px_60px_-25px_rgba(15,23,42,0.35)] transition">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={d.avatar || "/avatar.png"}
                                        alt={d.name}
                                        className="w-14 h-14 rounded-full object-cover shadow"
                                    />
                                    <div>
                                        <p className="font-semibold text-slate-900">{d.name}</p>
                                        <p className="text-xs text-slate-500">{d.email}</p>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-2 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Droplet size={14} className="text-rose-600" />
                                        <span className="font-medium">{d.bloodGroup}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-slate-500" />
                                        <span>
                                            {d.district}, {d.upazila}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
