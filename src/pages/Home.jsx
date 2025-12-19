import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function Home() {
    return (
        <div className="bg-slate-50">
            {/* HERO */}
            <section className="max-w-7xl mx-auto px-6 py-24 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                    Donate Blood. <span className="text-blue-600">Save Lives.</span>
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-slate-600">
                    LifeLink connects blood donors, volunteers, and patients in real time —
                    making blood donation faster, safer, and more accessible.
                </p>

                <div className="mt-8 flex justify-center gap-4">
                    <Link to="/register">
                        <Button size="lg">Get Started</Button>
                    </Link>
                    <Link to="/login">
                        <Button variant="secondary" size="lg">
                            Login
                        </Button>
                    </Link>
                </div>
            </section>

            {/* FEATURES */}
            <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
                <Card>
                    <h3 className="font-semibold text-lg">Real-Time Requests</h3>
                    <p className="mt-2 text-sm text-slate-600">
                        Instantly create and respond to blood requests in your area.
                    </p>
                </Card>

                <Card>
                    <h3 className="font-semibold text-lg">Verified Volunteers</h3>
                    <p className="mt-2 text-sm text-slate-600">
                        Trusted volunteers help coordinate donations efficiently.
                    </p>
                </Card>

                <Card>
                    <h3 className="font-semibold text-lg">Secure & Reliable</h3>
                    <p className="mt-2 text-sm text-slate-600">
                        Role-based access with secure authentication and data protection.
                    </p>
                </Card>
            </section>

            {/* CTA */}
            <section className="bg-blue-600 text-white py-16 text-center">
                <h2 className="text-3xl font-semibold">
                    Be someone’s lifeline today
                </h2>
                <p className="mt-2 opacity-90">
                    Join LifeLink and make a real impact.
                </p>
                <div className="mt-6">
                    <Link to="/register">
                        <Button variant="secondary" size="lg">
                            Join Now
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
