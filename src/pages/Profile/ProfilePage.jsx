/* eslint-disable no-unused-vars */
import { useState } from "react";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import { User, Shield } from "lucide-react";

export default function ProfilePage() {
    const [tab, setTab] = useState("profile");

    return (
        <div className="space-y-10">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                    My Profile
                </h1>
                <p className="mt-1 text-slate-500">
                    Manage your personal information and account security
                </p>
            </div>

            {/* TAB WRAPPER */}
            <div className="inline-flex rounded-2xl bg-white/70 backdrop-blur-md shadow p-1">
                <TabButton
                    active={tab === "profile"}
                    onClick={() => setTab("profile")}
                    icon={User}
                >
                    Profile Info
                </TabButton>

                <TabButton
                    active={tab === "security"}
                    onClick={() => setTab("security")}
                    icon={Shield}
                >
                    Security
                </TabButton>
            </div>

            {/* CONTENT */}
            <div className="rounded-3xl bg-white/70 backdrop-blur-md shadow-xl p-8">
                {tab === "profile" && <ProfileInfo />}
                {tab === "security" && <ChangePassword />}
            </div>
        </div>
    );
}

/* ===============================
   TAB BUTTON
================================ */
function TabButton({ children, active, onClick, icon: Icon }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer
            ${active
                    ? "bg-rose-600 text-white shadow"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
        >
            <Icon size={16} />
            {children}
        </button>
    );
}
