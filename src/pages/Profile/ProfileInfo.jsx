import { useContext, useEffect, useState } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

export default function ProfileInfo() {
    const { user, loading } = useContext(AuthContext);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || "",
                avatar: user.avatar || "",
                bloodGroup: user.bloodGroup || "",
                district: user.district || "",
                upazila: user.upazila || "",
            });
        }
    }, [user]);

    if (loading) return null;

    const submit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMsg("");

        try {
            await API.patch("/auth/profile", form);
            setMsg("Profile updated successfully");
        } catch {
            setMsg("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-5">
            {msg && (
                <p className="text-sm text-center text-green-600 bg-green-50 py-2 rounded-lg">
                    {msg}
                </p>
            )}

            <Field label="Name">
                <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input"
                />
            </Field>

            <Field label="Email">
                <input value={user.email} readOnly className="input bg-slate-100" />
            </Field>

            <div className="grid md:grid-cols-2 gap-4">
                <Field label="Blood Group">
                    <input
                        value={form.bloodGroup}
                        onChange={(e) =>
                            setForm({ ...form, bloodGroup: e.target.value })
                        }
                        className="input"
                    />
                </Field>

                <Field label="District">
                    <input
                        value={form.district}
                        onChange={(e) => setForm({ ...form, district: e.target.value })}
                        className="input"
                    />
                </Field>
            </div>

            <Field label="Upazila">
                <input
                    value={form.upazila}
                    onChange={(e) => setForm({ ...form, upazila: e.target.value })}
                    className="input"
                />
            </Field>

            <button
                disabled={saving}
                className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-xl text-sm font-medium cursor-pointer"
            >
                {saving ? "Saving..." : "Save Changes"}
            </button>
        </form>
    );
}

function Field({ label, children }) {
    return (
        <div>
            <label className="block text-sm text-slate-600 mb-1">{label}</label>
            {children}
        </div>
    );
}
