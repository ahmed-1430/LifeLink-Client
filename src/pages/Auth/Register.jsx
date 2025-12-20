import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import Button from "../../component/ui/Button";
import { Eye, EyeOff, Upload } from "lucide-react";

export default function Register() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirm_password: "",
        bloodGroup: "",
        district: "",
        upazila: "",
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    /* ---------------- Load Districts ---------------- */
    useEffect(() => {
        API.get("/districts")
            .then((res) => setDistricts(res.data || []))
            .catch(() => setDistricts([]));
    }, []);

    /* ---------------- Load Upazilas ---------------- */
    useEffect(() => {
        if (!form.district) return setUpazilas([]);
        API.get(`/upazilas/${form.district}`)
            .then((res) => setUpazilas(res.data || []))
            .catch(() => setUpazilas([]));
    }, [form.district]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    /* ---------------- Validation ---------------- */
    const validate = () => {
        if (!form.name) return "Name is required";
        if (!form.email) return "Email is required";
        if (form.password.length < 6)
            return "Password must be at least 6 characters";
        if (form.password !== form.confirm_password)
            return "Passwords do not match";
        if (!form.bloodGroup) return "Select blood group";
        if (!form.district) return "Select district";
        if (!form.upazila) return "Select upazila";
        return null;
    };

    /* ---------------- Image Upload (imgBB) ---------------- */
    const uploadAvatar = async () => {
        if (!avatarFile) return null;

        const formData = new FormData();
        formData.append("image", avatarFile);

        const res = await fetch(
            `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await res.json();
        return data?.data?.url || null;
    };

    /* ---------------- Submit ---------------- */
    const submit = async (e) => {
        e.preventDefault();
        setError("");

        const v = validate();
        if (v) return setError(v);

        setLoading(true);

        try {
            const avatarUrl = await uploadAvatar();

            const payload = {
                name: form.name,
                email: form.email,
                password: form.password,
                avatar: avatarUrl,
                bloodGroup: form.bloodGroup,
                district: form.district,
                upazila: form.upazila,
            };

            const res = await API.post("/register", payload);

            // auto login
            const loginRes = await API.post("/login", {
                email: form.email,
                password: form.password,
            });

            login(loginRes.data.token, loginRes.data.user);
            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.message || "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid md:grid-cols-2 bg-[#F8FAFC]">

            {/* LEFT */}
            <div className="hidden md:flex flex-col justify-center px-16 bg-linear-to-br from-rose-50 via-white to-blue-50">
                <h1 className="text-3xl font-bold text-slate-900">
                    Create your LifeLink account
                </h1>
                <p className="mt-4 text-slate-600">
                    Join as a donor and help save lives across the country.
                </p>
            </div>

            {/* RIGHT */}
            <div className="flex items-center justify-center px-6">
                <div className="w-full max-w-md bg-white border rounded-2xl shadow-xl p-8">

                    <h2 className="text-2xl text-rose-500 font-semibold text-center mb-1">
                        Sign up
                    </h2>
                    <p className="text-sm text-slate-500 text-center mb-4">
                        Create your account
                    </p>

                    {error && (
                        <div className="text-sm text-red-600 text-center mb-3">
                            {error}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">

                        <input
                            name="name"
                            placeholder="Full name"
                            className="w-full input bg-white text-slate-500 border-2 border-slate-500/30"
                            value={form.name}
                            onChange={handleChange}
                        />

                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            className="w-full input bg-white text-slate-500 border-2 border-slate-500/30"
                            value={form.email}
                            onChange={handleChange}
                        />

                        {/* Avatar */}
                        <label className="flex items-center gap-2 text-sm cursor-pointer text-rose-500">
                            <Upload size={16} />
                            Upload avatar
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) => setAvatarFile(e.target.files[0])}
                            />
                        </label>

                        {/* Password */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                className="w-full input pr-10 bg-white text-slate-500 border-2 border-slate-500/30"
                                value={form.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-slate-500"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                name="confirm_password"
                                placeholder="Confirm password"
                                className="w-full input pr-10 bg-white text-slate-500 border-2 border-slate-500/30"
                                value={form.confirm_password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-2.5 text-slate-500"
                            >
                                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Blood group */}
                        <select
                            name="bloodGroup"
                            className="w-full input bg-white text-slate-500 border-2 border-slate-500/30 cursor-pointer"
                            value={form.bloodGroup}
                            onChange={handleChange}
                        >
                            <option value="">Select blood group</option>
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                                <option key={bg}>{bg}</option>
                            ))}
                        </select>

                        {/* District */}
                        <select
                            name="district"
                            className="w-full input bg-white text-slate-500 border-2 border-slate-500/30 cursor-pointer"
                            value={form.district}
                            onChange={handleChange}
                        >
                            <option value="">Select district</option>
                            {districts.map((d) => (
                                <option key={d._id} value={d._id}>
                                    {d.name}
                                </option>
                            ))}
                        </select>

                        {/* Upazila */}
                        <select
                            name="upazila"
                            className="w-full input bg-white text-slate-500 border-2 border-slate-500/30 cursor-pointer"
                            value={form.upazila}
                            onChange={handleChange}
                        >
                            <option value="">Select upazila</option>
                            {upazilas.map((u) => (
                                <option key={u._id}>{u.name}</option>
                            ))}
                        </select>

                        <Button loading={loading} className="w-full">
                            Create account
                        </Button>
                    </form>

                    <p className="text-sm text-center mt-4 text-slate-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-rose-600 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
