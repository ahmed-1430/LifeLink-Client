/* eslint-disable react-hooks/rules-of-hooks */
import { Link, Navigate } from "react-router-dom";
import { useContext } from "react";
import {
  Droplet,
  Search,
  HeartHandshake,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import Button from "../component/ui/Button";
import useReveal from "../hooks/useScrollReveal";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);

  if (user) return <Navigate to="/dashboard" replace />;

  const heroRef = useReveal();
  const featureRef = useReveal();
  const contactRef = useReveal();

  return (
    <div className="relative overflow-hidden bg-[#F8FAFC] text-slate-900">

      {/* ================= HERO ================= */}
      <section ref={heroRef} className="relative">
        {/* SOFT GLOWS */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -left-40 h-[520px] w-[520px] bg-rose-300/40 rounded-full blur-[160px]" />
          <div className="absolute top-1/3 -right-40 h-[420px] w-[420px] bg-blue-300/40 rounded-full blur-[160px]" />
          <div className="absolute bottom-0 left-1/3 h-[380px] w-[380px] bg-purple-300/30 rounded-full blur-[160px]" />
        </div>

        <div className="relative w-11/12  mx-auto py-32 grid md:grid-cols-2 gap-20 items-center">
          {/* LEFT */}
          <div>
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full
              bg-white/70 backdrop-blur-md text-sm text-rose-600
              shadow-[0_8px_30px_rgba(244,63,94,0.15)]">
              <Droplet size={14} />
              Trusted Blood Donation Platform
            </span>

            <h1 className="mt-8 text-5xl md:text-6xl font-extrabold leading-tight">
              Donate Blood.
              <br />
              <span className="bg-linear-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
                Save Lives.
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-600 max-w-xl">
              LifeLink connects donors, volunteers, and patients to ensure
              fast, verified blood donation when it matters most.
            </p>

            <div className="mt-10 flex gap-5 flex-wrap">
              <Link to="/register">
                <btn
                  className="flex items-center gap-2 px-10 py-4 rounded-2xl
                  bg-linear-to-r from-rose-500 to-pink-600 text-white
                  shadow-[0_20px_50px_-15px_rgba(244,63,94,0.45)]
                  hover:scale-[1.03] transition"
                >
                  <HeartHandshake size={20} />
                  Join as Donor
                </btn>
              </Link>

              <Link to="/search">
                <btn
                  className="flex items-center gap-2 px-10 py-4 rounded-2xl
                  bg-white/70 backdrop-blur-lg
                  shadow-[0_10px_30px_rgba(15,23,42,0.08)]
                  hover:bg-white transition text-slate-700 hover:text-slate-500"
                >
                  <Search size={20} />
                  Search Donors
                </btn>
              </Link>
            </div>
          </div>

          {/* RIGHT GLASS CARD */}
          <div className="hidden md:block">
            <div
              className="rounded-4xl bg-white/70 backdrop-blur-xl p-8
              shadow-[0_40px_80px_-30px_rgba(15,23,42,0.15)]"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Droplet size={22} />
                </div>
                <div>
                  <p className="font-semibold">Emergency Requests</p>
                  <p className="text-xs text-slate-500">
                    Verified & moderated
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-600">
                Patients can quickly reach nearby donors through
                trusted volunteers and admin verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section
        ref={featureRef}
        className="relative w-11/12 mx-auto py-32 grid md:grid-cols-3 gap-10"
      >
        {[
          ["Find Donors Instantly", "Search by blood group & location in seconds"],
          ["Role-Based Security", "Admin, Volunteer & Donor control"],
          ["Safe & Reliable", "Verified requests with accountability"],
        ].map(([title, desc], i) => (
          <div
            key={i}
            className="rounded-[28px] bg-white/70 backdrop-blur-xl p-8
              shadow-[0_30px_70px_-30px_rgba(15,23,42,0.12)]
              hover:-translate-y-2 transition"
          >
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-3 text-slate-600">{desc}</p>
          </div>
        ))}
      </section>

      {/* ================= CONTACT ================= */}
      <section
        ref={contactRef}
        className="relative py-36"
      >
        {/* SOFT CENTER GLOW */}
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px]
            -translate-x-1/2 -translate-y-1/2
            bg-rose-300/30 rounded-full blur-[180px]" />
        </div>

        <div className="relative w-11/12 mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold">
              Need Help?
              <span className="block text-rose-600">We’re Always Here.</span>
            </h2>
            <p className="mt-4 text-slate-600">
              Emergency support, questions, or platform assistance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Phone />,
                title: "Call Support",
                sub: "24/7 Emergency Line",
                value: "+880 1234-567890",
                color: "rose",
              },
              {
                icon: <Mail />,
                title: "Email Us",
                sub: "Response within 24h",
                value: "support@lifelink.org",
                color: "blue",
              },
              {
                icon: <MessageSquare />,
                title: "Dashboard Help",
                sub: "Login required",
                value: "Go to Dashboard",
                color: "emerald",
                link: "/login",
              },
            ].map((c, i) => (
              <div
                key={i}
                className="rounded-4xl bg-white/70 backdrop-blur-xl p-8
                shadow-[0_40px_90px_-40px_rgba(15,23,42,0.15)]
                hover:scale-[1.03] transition"
              >
                <div
                  className={`h-14 w-14 rounded-2xl
                  bg-${c.color}-100 text-${c.color}-600
                  flex items-center justify-center mb-6`}
                >
                  {c.icon}
                </div>

                <h3 className="text-xl font-semibold">{c.title}</h3>
                <p className="mt-2 text-slate-600">{c.sub}</p>

                {c.link ? (
                  <Link
                    to={c.link}
                    className="inline-block mt-4 text-sm font-medium text-rose-600 hover:underline"
                  >
                    {c.value} →
                  </Link>
                ) : (
                  <p className="mt-4 font-medium">{c.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
