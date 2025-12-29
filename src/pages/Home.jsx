import { Link } from "react-router-dom";
import Button from "../component/ui/Button";
import useReveal from "../hooks/useScrollReveal";
import { Droplet, Search } from "lucide-react";

export default function Home() {
  const heroRef = useReveal();
  const featureRef = useReveal();
  const ctaRef = useReveal();

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A]">
      {/* HERO */}
      <section ref={heroRef} className="reveal relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-linear-to-br from-rose-50 via-white to-blue-50" />

        {/* Glow */}
        <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-rose-400/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-400/20 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div>
            <span className="inline-flex items-center gap-2 mb-6 px-4 py-1 text-sm rounded-full bg-rose-100 text-rose-700">
              <Droplet size={14} />
              A life-saving blood donation platform
            </span>

            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Give Blood.
              <br />
              <span className="text-rose-600">Save Lives.</span>
            </h1>

            <p className="mt-6 text-lg text-slate-600 max-w-xl">
              LifeLink connects blood donors, volunteers, and patients to ensure
              timely blood donation when it matters most.
            </p>

            <div className="mt-10 flex gap-4 flex-wrap">
              <Link to="/search">
                <Button className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-xl shadow-lg">
                  <Search size={18} />
                  Search Donors
                </Button>
              </Link>

              <Link to="/login">
                <Button
                  variant="secondary"
                  className="border border-slate-300 px-8 py-3 rounded-xl"
                >
                  Donate Blood
                </Button>
              </Link>
            </div>
          </div>

          {/* RIGHT (INFO CARD) */}
          <div className="hidden md:flex justify-center">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-[360px] border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Droplet size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    Emergency Blood Request
                  </p>
                  <p className="text-xs text-slate-500">
                    Nearby hospital • Any moment
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-600">
                LifeLink helps patients quickly reach nearby donors during
                emergencies through verified requests.
              </p>

              <p className="mt-4 text-xs text-slate-400">
                * Requests are managed securely after login
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        ref={featureRef}
        className="reveal max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-3 gap-12"
      >
        {[
          {
            title: "Search Donors Easily",
            desc: "Find blood donors by group and location instantly.",
          },
          {
            title: "Volunteer & Admin Support",
            desc: "Requests are verified and managed responsibly.",
          },
          {
            title: "Secure & Reliable",
            desc: "Role-based access with secure authentication.",
          },
        ].map((f, i) => (
          <div key={i}>
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section
        ref={ctaRef}
        className="reveal bg-linear-to-r from-rose-600/70 to-rose-700/90 py-24 text-center text-white"
      >
        <h2 className="text-3xl font-bold">
          Your blood can save a life today.
        </h2>
        <p className="mt-3 text-rose-100">
          Join LifeLink and become a part of the life-saving community.
        </p>

        <div className="mt-8">
          <Link to="/register">
            <Button className="px-10 py-3 rounded-xl font-semibold shadow-lg">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
