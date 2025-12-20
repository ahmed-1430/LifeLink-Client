import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import Button from "../../component/ui/Button";
import { Droplet } from "lucide-react";

const defaultAvatar = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
    )}&background=E11D48&color=fff&rounded=true`;

export default function Register() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        avatar: "",
        bloodGroup: "",
        district: "",
        upazila: "",
    });

    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [fetchingDistricts, setFetchingDistricts] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* ---------------- Load Districts ---------------- */
    useEffect(() => {
        const loadDistricts = async () => {
            try {
                setFetchingDistricts(true);
                const res = await API.get("/districts");
                setDistricts(Array.isArray(res.data) ? res.data : []);
            } catch {
                setDistricts([]);
            } finally {
                setFetchingDistricts(false);
            }
        };
        loadDistricts();
    }, []);

    /* ---------------- Load Upazilas ---------------- */
    useEffect(() => {
        if (!form.district) return setUpazilas([]);
        const loadUpazilas = async () => {
            try {
                const res = await API.get(`/upazilas/${form.district}`);
                setUpazilas(Array.isArray(res.data) ? res.data : []);
            } catch {
                setUpazilas([]);
            }
        };
        loadUpazilas();
    }, [form.district]);

    const handleChange = (e) =>
        setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

    const validate = () => {
        if (!form.name) return "Full name is required.";
        if (!form.email) return "Email is required.";
        if (form.password.length < 6)
            return "Password must be at least 6 characters.";
        if (!form.bloodGroup) return "Select blood group.";
        if (!form.district) return "Select district.";
        if (!form.upazila) return "Select upazila.";
        return null;
    };

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        const v = validate();
        if (v) return setError(v);

        setLoading(true);

        try {
            const payload = {
                ...form,
                avatar: form.avatar || defaultAvatar(form.name),
            };

            const res = await API.post("/register", payload);
            const token = res.data?.token;
            const user = res.data?.user;

            if (token) {
                login(token, user);
                return navigate("/dashboard");
            }

            const loginRes = await API.post("/login", {
                email: form.email,
                password: form.password,
            });

            login(loginRes.data.token, loginRes.data.user);
            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid md:grid-cols-2 bg-[#F8FAFC]">

            {/* LEFT BRAND */}
            <div className="hidden md:flex flex-col justify-center px-16 bg-linear-to-br from-rose-50 via-white to-blue-50">
                <div className="max-w-md">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                            L
                        </span>
                        <span className="text-xl font-bold text-slate-900">LifeLink</span>
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900">
                        Become a donor.
                        <br />
                        Save lives today.
                    </h1>

                    <p className="mt-4 text-slate-600">
                        Join a trusted blood donation network helping people when every
                        minute matters.
                    </p>
                </div>
            </div>

            {/* RIGHT FORM */}
            <div className="flex items-center justify-center px-6">
                <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-8">

                    <div className="text-center">
                        <div className="mx-auto w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                            <Droplet size={22} />
                        </div>

                        <h2 className="text-2xl font-semibold text-slate-900">
                            Create your account
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            It takes less than a minute
                        </p>
                    </div>

                    {error && (
                        <div className="mt-4 text-sm text-red-600 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={submit} className="mt-6 space-y-4">

                        {/* Inputs */}
                        {[
                            { name: "name", placeholder: "Full name" },
                            { name: "email", placeholder: "Email address", type: "email" },
                            { name: "password", placeholder: "Password", type: "password" },
                            { name: "avatar", placeholder: "Avatar URL (optional)" },
                        ].map((f) => (
                            <input
                                key={f.name}
                                name={f.name}
                                type={f.type || "text"}
                                placeholder={f.placeholder}
                                value={form[f.name]}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 text-slate-600 px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                            />
                        ))}

                        <select
                            name="bloodGroup"
                            value={form.bloodGroup}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-600"
                        >
                            <option value="">Select blood group</option>
                            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                                <option key={bg}>{bg}</option>
                            ))}
                        </select>

                        <select
                            name="district"
                            value={form.district}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-600"
                        >
                            <option value="">
                                {fetchingDistricts ? "Loading districts..." : "Select district"}
                            </option>
                            {districts.map((d) => (
                                <option key={d.id || d._id} value={d.id || d._id}>
                                    {d.name}
                                </option>
                            ))}
                        </select>

                        <select
                            name="upazila"
                            value={form.upazila}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-600"
                        >
                            <option value="">
                                {upazilas.length ? "Select upazila" : "Choose district first"}
                            </option>
                            {upazilas.map((u) => (
                                <option key={u.id || u._id}>{u.name}</option>
                            ))}
                        </select>

                        <Button loading={loading} className="w-full mt-2">
                            Create account
                        </Button>
                    </form>

                    <p className="mt-6 text-sm text-center text-slate-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-rose-600 font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
