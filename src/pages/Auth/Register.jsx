import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import Button from "../../component/ui/Button";
import { Eye, EyeOff, Upload } from "lucide-react";

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
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    /* ===============================
       REDIRECT IF LOGGED IN
    ================================ */
    useEffect(() => {
        if (!authLoading && user) {
            navigate("/dashboard", { replace: true });
        }
    }, [user, authLoading, navigate]);

    /* ===============================
       LOAD DISTRICTS
    ================================ */
    useEffect(() => {
        API.get("/geo/districts")
            .then((res) => setDistricts(res.data || []))
            .catch(() => setDistricts([]));
    }, []);

    /* ===============================
       LOAD UPAZILAS
    ================================ */
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

    /* ===============================
       VALIDATION
    ================================ */
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

    /* ===============================
       OPTIONAL AVATAR UPLOAD
    ================================ */
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
            return null; // fail silently
        }
    };

    /* ===============================
       SUBMIT
    ================================ */
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

            // Redirect to login after successful registration
            navigate("/login", {
                state: { registered: true },
                replace: true,
            });
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setSubmitting(false);
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
                    <h2 className="text-2xl text-rose-600 font-semibold text-center mb-1">
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
                            className="w-full input border"
                            value={form.name}
                            onChange={handleChange}
                        />

                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            className="w-full input border"
                            value={form.email}
                            onChange={handleChange}
                        />

                        {/* Avatar */}
                        <label className="flex items-center gap-2 text-sm cursor-pointer text-rose-600">
                            <Upload size={16} />
                            Upload avatar (optional)
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
                                className="w-full input border pr-10"
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

                        {/* Confirm */}
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm password"
                                className="w-full input border pr-10"
                                value={form.confirmPassword}
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

                        {/* Blood */}
                        <select
                            name="bloodGroup"
                            className="w-full input border"
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
                            className="w-full input border"
                            value={form.district}
                            onChange={handleChange}
                        >
                            <option value="">Select district</option>
                            {districts.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name}
                                </option>
                            ))}
                        </select>

                        {/* Upazila */}
                        <select
                            name="upazila"
                            className="w-full input border"
                            value={form.upazila}
                            onChange={handleChange}
                        >
                            <option value="">Select upazila</option>
                            {upazilas.map((u) => (
                                <option key={u.id}>{u.name}</option>
                            ))}
                        </select>

                        <Button
                            type="submit"
                            disabled={submitting}
                            className="w-full"
                        >
                            {submitting ? "Creating account..." : "Create account"}
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
