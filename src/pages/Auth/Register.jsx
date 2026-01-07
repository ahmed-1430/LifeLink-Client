import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import Button from "../../component/ui/Button";
import {
    Eye,
    EyeOff,
    Upload,
    Droplet,
    User
} from "lucide-react";

export default function Register() {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useContext(AuthContext);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        bloodGroup: "",
        district: "",
        upazila: "",
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    /* ================= REDIRECT ================= */
    useEffect(() => {
        if (!authLoading && user) {
            navigate("/dashboard", { replace: true });
        }
    }, [user, authLoading, navigate]);

    /* ================= LOAD DISTRICTS ================= */
    useEffect(() => {
        API.get("/geo/districts")
            .then((res) => setDistricts(res.data || []))
            .catch(() => setDistricts([]));
    }, []);

    /* ================= LOAD UPAZILAS ================= */
    useEffect(() => {
        if (!form.district) {
            setUpazilas([]);
            return;
        }

        API.get(`/geo/upazilas/${form.district}`)
            .then((res) => setUpazilas(res.data || []))
            .catch(() => setUpazilas([]));
    }, [form.district]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    /* ================= VALIDATION ================= */
    const validate = () => {
        if (!form.name) return "Name is required";
        if (!form.email) return "Email is required";
        if (form.password.length < 6)
            return "Password must be at least 6 characters";
        if (form.password !== form.confirmPassword)
            return "Passwords do not match";
        if (!form.bloodGroup) return "Select blood group";
        if (!form.district) return "Select district";
        if (!form.upazila) return "Select upazila";
        return null;
    };

    /* ================= AVATAR UPLOAD ================= */
    const uploadAvatar = async () => {
        if (!avatarFile) return null;

        try {
            const formData = new FormData();
            formData.append("image", avatarFile);

            const res = await fetch(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
                { method: "POST", body: formData }
            );

            const data = await res.json();
            return data?.data?.url || null;
        } catch {
            return null;
        }
    };

    /* ================= SUBMIT ================= */
    const submit = async (e) => {
        e.preventDefault();
        setError("");

        const validationError = validate();
        if (validationError) return setError(validationError);

        setSubmitting(true);

        try {
            const avatar = await uploadAvatar();

            await API.post("/auth/register", {
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
                avatar,
                bloodGroup: form.bloodGroup,
                district: form.district,
                upazila: form.upazila,
            });

            navigate("/login", { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen grid md:grid-cols-2 bg-[#F8FAFC]">

            {/* ================= LEFT ================= */}
            <div className="hidden md:flex items-center justify-center relative overflow-hidden px-16">
                <div className="absolute inset-0 bg-linear-to-br from-rose-50 via-white to-blue-50" />
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-300/30 rounded-full blur-[140px]" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300/20 rounded-full blur-[120px]" />

                <div className="relative max-w-md">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                            L
                        </span>
                        <span className="text-xl font-bold text-slate-900">
                            LifeLink
                        </span>
                    </div>

                    <h1 className="text-4xl font-bold text-slate-900 leading-tight">
                        Join LifeLink.
                        <br />
                        Become a hero.
                    </h1>

                    <p className="mt-4 text-slate-600">
                        Register as a blood donor and help save lives in your community.
                    </p>
                </div>
            </div>

            {/* ================= RIGHT ================= */}
            <div className="flex items-center justify-center px-6 py-6">
                <div
                    className="
            w-full max-w-md
            bg-white/70 backdrop-blur-xl
            rounded-3xl
            shadow-[0_25px_60px_-30px_rgba(15,23,42,0.35)]
            p-8
          "
                >
                    {/* HEADER */}
                    <div className="text-center">
                        <div className="mx-auto w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                            <Droplet size={22} />
                        </div>

                        <h2 className="text-2xl font-semibold text-slate-900">
                            Create your account
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Join LifeLink as a donor
                        </p>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div className="mt-4 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2 text-center">
                            {error}
                        </div>
                    )}

                    {/* FORM */}
                    <form onSubmit={submit} className="mt-6 space-y-4">

                        {/* AVATAR */}
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="text-slate-400" />
                                )}
                            </div>

                            <label className="text-sm font-medium text-rose-600 cursor-pointer inline-flex items-center gap-2">
                                <Upload size={16} />
                                Upload avatar (optional)
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => {
                                        setAvatarFile(e.target.files[0]);
                                        setAvatarPreview(URL.createObjectURL(e.target.files[0]));
                                    }}
                                />
                            </label>
                        </div>

                        <input
                            name="name"
                            placeholder="Full name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full rounded-xl px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-rose-500 outline-none"
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-xl px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-rose-500 outline-none"
                        />

                        {/* PASSWORD */}
                        <PasswordInput
                            label="Password"
                            value={form.password}
                            onChange={(v) => setForm({ ...form, password: v })}
                            show={showPassword}
                            toggle={() => setShowPassword((v) => !v)}
                        />

                        <PasswordInput
                            label="Confirm Password"
                            value={form.confirmPassword}
                            onChange={(v) => setForm({ ...form, confirmPassword: v })}
                            show={showConfirm}
                            toggle={() => setShowConfirm((v) => !v)}
                        />

                        {/* BLOOD */}
                        <select
                            name="bloodGroup"
                            value={form.bloodGroup}
                            onChange={handleChange}
                            className="w-full rounded-xl px-4 py-2.5 shadow-sm"
                        >
                            <option value="">Select blood group</option>
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                                <option key={bg}>{bg}</option>
                            ))}
                        </select>

                        {/* DISTRICT */}
                        <select
                            name="district"
                            value={form.district}
                            onChange={handleChange}
                            className="w-full rounded-xl px-4 py-2.5 shadow-sm"
                        >
                            <option value="">Select district</option>
                            {districts.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name}
                                </option>
                            ))}
                        </select>

                        {/* UPAZILA */}
                        <select
                            name="upazila"
                            value={form.upazila}
                            onChange={handleChange}
                            className="w-full rounded-xl px-4 py-2.5 shadow-sm"
                        >
                            <option value="">Select upazila</option>
                            {upazilas.map((u) => (
                                <option key={u.id}>{u.name}</option>
                            ))}
                        </select>

                        <Button type="submit" disabled={submitting} className="w-full mt-2 cursor-pointer">
                            {submitting ? "Creating account..." : "Create account"}
                        </Button>
                    </form>

                    <p className="mt-6 text-sm text-center text-slate-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-rose-600 font-medium hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ================= PASSWORD INPUT ================= */
function PasswordInput({ label, value, onChange, show, toggle }) {
    return (
        <div>
            <label className="block text-sm text-slate-600 mb-1">
                {label}
            </label>

            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full rounded-xl px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-rose-500 outline-none pr-10"
                />

                <button
                    type="button"
                    onClick={toggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        </div>
    );
}
