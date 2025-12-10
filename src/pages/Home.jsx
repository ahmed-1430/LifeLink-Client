import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="bg-slate-50">

            {/* Hero Section */}
            <section className="px-6 md:px-12 lg:px-20 py-20 flex flex-col md:flex-row items-center gap-12">

                {/* Left Text */}
                <div className="flex-1">
                    <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-slate-900 mb-4">
                        Connecting <span className="text-blue-600">Donors</span> and
                        <br />Saving Lives with <span className="text-red-500">LifeLink</span>
                    </h1>

                    <p className="text-slate-600 text-lg mb-6">
                        LifeLink makes blood donation faster, easier, and more reliable.
                        Request blood instantly or become a donor and save lives today.
                    </p>

                    <div className="flex gap-4 mt-4">
                        <Link
                            to="/register"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                        >
                            Get Started
                        </Link>

                        <Link
                            to="/login"
                            className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition"
                        >
                            Login
                        </Link>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="flex-1 hidden md:flex justify-center">
                    <img
                        src="https://i.ibb.co/F6Tbtcd/blood-donation-illustration.png"
                        alt="blood donation"
                        className="w-[350px] md:w-[420px]"
                    />
                </div>
            </section>

            {/* Features Section */}
            <section className="px-6 md:px-12 lg:px-20 py-16 bg-white border-t">
                <h2 className="text-3xl font-semibold text-center mb-12">
                    Why Choose LifeLink?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="bg-slate-50 p-6 rounded-xl border shadow-sm hover:shadow-md transition">
                        <div className="text-3xl mb-4">🩸</div>
                        <h3 className="text-xl font-semibold mb-2">Fast Blood Requests</h3>
                        <p className="text-slate-600">
                            Instantly request blood from donors near your district and upazila.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-slate-50 p-6 rounded-xl border shadow-sm hover:shadow-md transition">
                        <div className="text-3xl mb-4">🤝</div>
                        <h3 className="text-xl font-semibold mb-2">Donor Network</h3>
                        <p className="text-slate-600">
                            A growing community of verified donors ready to help at any moment.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-slate-50 p-6 rounded-xl border shadow-sm hover:shadow-md transition">
                        <div className="text-3xl mb-4">📍</div>
                        <h3 className="text-xl font-semibold mb-2">Location-Based Search</h3>
                        <p className="text-slate-600">
                            Search blood availability based on district & upazila for accuracy.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="px-6 md:px-12 lg:px-20 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 text-center gap-10">
                    <div>
                        <h3 className="text-4xl font-bold text-blue-600">10,000+</h3>
                        <p className="text-slate-600 mt-1">Lives Impacted</p>
                    </div>

                    <div>
                        <h3 className="text-4xl font-bold text-red-500">5,000+</h3>
                        <p className="text-slate-600 mt-1">Active Donors</p>
                    </div>

                    <div>
                        <h3 className="text-4xl font-bold text-green-600">1,200+</h3>
                        <p className="text-slate-600 mt-1">Successful Requests</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 md:px-12 lg:px-20 py-20 bg-blue-600 text-white text-center rounded-t-3xl">
                <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                    Ready to Make a Difference?
                </h2>
                <p className="text-lg mb-6">
                    Join thousands of donors contributing to save precious lives.
                </p>

                <Link
                    to="/register"
                    className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-slate-100 transition"
                >
                    Become a Donor
                </Link>
            </section>

        </div>
    );
}
