import { useState } from "react";
import API from "../../api/axios";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function ChangePassword() {
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
    });

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess("");
        setError("");

        try {
            await API.patch("/auth/password", form);
            setSuccess("Password updated successfully");
            setForm({ currentPassword: "", newPassword: "" });
        } catch (err) {
            setError(err.response?.data?.message || "Password update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md">

            {/* GLASS CARD */}
            <div className="
                rounded-3xl border border-white/30
                bg-white/70 backdrop-blur-xl
                shadow-xl px-6 py-8
            ">
                {/* HEADER */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center">
                        <Lock size={20} className="text-rose-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Change Password
                        </h2>
                        <p className="text-xs text-slate-500">
                            Keep your account secure
                        </p>
                    </div>
                </div>

                {/* FEEDBACK */}
                {success && (
                    <div className="mb-4 rounded-xl bg-green-50 text-green-700 px-4 py-2.5 text-sm">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="mb-4 rounded-xl bg-red-50 text-red-700 px-4 py-2.5 text-sm">
                        {error}
                    </div>
                )}

                {/* FORM */}
                <form onSubmit={submit} className="space-y-5">

                    {/* CURRENT PASSWORD */}
                    <PasswordField
                        label="Current Password"
                        value={form.currentPassword}
                        onChange={(v) =>
                            setForm({ ...form, currentPassword: v })
                        }
                        show={showCurrent}
                        toggle={() => setShowCurrent(!showCurrent)}
                    />

                    {/* NEW PASSWORD */}
                    <PasswordField
                        label="New Password"
                        value={form.newPassword}
                        onChange={(v) =>
                            setForm({ ...form, newPassword: v })
                        }
                        show={showNew}
                        toggle={() => setShowNew(!showNew)}
                    />

                    {/* ACTION */}
                    <button
                        disabled={loading}
                        className="
                            w-full rounded-xl bg-rose-600 py-2.5
                            text-sm font-medium text-white
                            hover:bg-rose-700 transition
                            disabled:opacity-50 cursor-pointer
                        "
                    >
                        {loading ? "Updating password…" : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

/* ===============================
   PASSWORD FIELD
================================ */

function PasswordField({ label, value, onChange, show, toggle }) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm text-slate-600">{label}</label>

            <div className="
                flex items-center gap-2
                rounded-xl bg-slate-100
                px-4 py-2.5
                focus-within:bg-white
                focus-within:ring-2 focus-within:ring-rose-200
            ">
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="
                        w-full bg-transparent text-sm
                        focus:outline-none
                    "
                    required
                />

                <button
                    type="button"
                    onClick={toggle}
                    className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        </div>
    );
}
