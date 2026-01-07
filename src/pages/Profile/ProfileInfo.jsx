import { useContext, useEffect, useState } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { UserCircle } from "lucide-react";

export default function ProfileInfo() {
    const { user, loading } = useContext(AuthContext);

    const [form, setForm] = useState({
        name: "",
        avatar: "",
        bloodGroup: "",
        district: "",
        upazila: "",
        available: true,
        publicProfile: true,
    });

    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || "",
                avatar: user.avatar || "",
                bloodGroup: user.bloodGroup || "",
                district: user.district || "",
                upazila: user.upazila || "",
                available: user.available ?? true,
                publicProfile: user.publicProfile ?? true,
            });
        }
    }, [user]);

    if (loading) return null;

    const submit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccess("");
        setError("");

        try {
            await API.patch("/auth/profile", form);
            setSuccess("Profile updated successfully");
        } catch {
            setError("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-10">

            {/* PROFILE HEADER */}
            <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden">
                    {form.avatar ? (
                        <img
                            src={form.avatar}
                            alt="avatar"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <UserCircle size={46} className="text-slate-400" />
                    )}
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                        {form.name || "Your Name"}
                    </h2>
                    <p className="text-sm text-slate-500">{user.email}</p>
                </div>
            </div>

            {/* FEEDBACK */}
            {success && (
                <div className="rounded-xl bg-green-50 text-green-700 px-4 py-3 text-sm">
                    {success}
                </div>
            )}

            {error && (
                <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">
                    {error}
                </div>
            )}

            {/* FORM */}
            <form onSubmit={submit} className="space-y-10">

                {/* BASIC INFO */}
                <Section title="Basic Information">
                    <SoftInput
                        label="Full Name"
                        value={form.name}
                        onChange={(v) => setForm({ ...form, name: v })}
                    />

                    <SoftInput
                        label="Email"
                        value={user.email}
                        readOnly
                    />
                </Section>

                {/* HEALTH & LOCATION */}
                <Section title="Health & Location">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <SoftInput
                            label="Blood Group"
                            value={form.bloodGroup}
                            onChange={(v) =>
                                setForm({ ...form, bloodGroup: v })
                            }
                        />

                        <SoftInput
                            label="District"
                            value={form.district}
                            onChange={(v) =>
                                setForm({ ...form, district: v })
                            }
                        />
                    </div>

                    <SoftInput
                        label="Upazila"
                        value={form.upazila}
                        onChange={(v) =>
                            setForm({ ...form, upazila: v })
                        }
                    />
                </Section>

                {/* PREFERENCES */}
                {/* <Section title="Preferences">
                    <Toggle
                        label="Available for Donation"
                        description="Allow volunteers to assign you donation requests"
                        checked={form.available}
                        onChange={(v) =>
                            setForm({ ...form, available: v })
                        }
                    />

                    <Toggle
                        label="Public Profile"
                        description="Show your profile in donor search results"
                        checked={form.publicProfile}
                        onChange={(v) =>
                            setForm({ ...form, publicProfile: v })
                        }
                    />
                </Section> */}

                {/* ACTION */}
                <div className="pt-4">
                    <button
                        disabled={saving}
                        className="
                            inline-flex items-center justify-center
                            rounded-xl bg-rose-600 px-6 py-2.5
                            text-white text-sm font-medium
                            hover:bg-rose-700 transition
                            disabled:opacity-50 cursor-pointer
                        "
                    >
                        {saving ? "Saving changes…" : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}

/* ===============================
   UI COMPONENTS
================================ */

function Section({ title, children }) {
    return (
        <div className="space-y-5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {title}
            </h3>
            <div className="space-y-4">{children}</div>
        </div>
    );
}

function SoftInput({ label, value, onChange, readOnly }) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm text-slate-600">{label}</label>
            <input
                value={value}
                readOnly={readOnly}
                onChange={(e) => onChange?.(e.target.value)}
                className={`
                    w-full rounded-xl px-4 py-2.5 text-sm
                    bg-slate-100 focus:bg-white
                    focus:outline-none focus:ring-2 focus:ring-rose-200
                    ${readOnly ? "cursor-not-allowed text-slate-500" : ""}
                `}
            />
        </div>
    );
}

function Toggle({ label, description, checked, onChange }) {
    return (
        <div className="flex items-start justify-between gap-6">
            <div>
                <p className="text-sm font-medium text-slate-800">
                    {label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                    {description}
                </p>
            </div>

            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`
                    relative inline-flex h-6 w-11 rounded-full transition
                    ${checked ? "bg-rose-600" : "bg-slate-300"}
                `}
            >
                <span
                    className={`
                        inline-block h-5 w-5 rounded-full bg-white shadow
                        transform transition
                        ${checked ? "translate-x-5" : "translate-x-1"}
                    `}
                />
            </button>
        </div>
    );
}
