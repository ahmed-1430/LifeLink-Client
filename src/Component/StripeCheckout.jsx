import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import API from "../api/axios";
import { Lock } from "lucide-react";

export default function StripeCheckout({ amount, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();

    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    const handlePay = async () => {
        if (!stripe || !elements) return;

        setProcessing(true);
        setError("");

        try {
            /* 1️⃣ Create payment intent */
            const intentRes = await API.post("/funds/create-intent", {
                amount: Number(amount),
            });

            const clientSecret = intentRes.data.clientSecret;

            /* 2️⃣ Confirm card payment */
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (result.error) {
                setError(result.error.message);
                setProcessing(false);
                return;
            }

            /* 3️⃣ Save funding record */
            await API.post("/funds", {
                amount: Number(amount),
                paymentId: result.paymentIntent.id,
            });

            onSuccess();
        } catch (err) {
            console.error(err);
            setError("Payment failed. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-4">

            {/* CARD INPUT */}
            <div
                className="
                rounded-2xl bg-white/70 backdrop-blur-md
                shadow-inner border border-slate-200
                px-4 py-4
            "
            >
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: "16px",
                                color: "#0f172a",
                                fontFamily:
                                    "Inter, system-ui, -apple-system, sans-serif",
                                "::placeholder": {
                                    color: "#94a3b8",
                                },
                            },
                            invalid: {
                                color: "#dc2626",
                            },
                        },
                    }}
                />
            </div>

            {/* ERROR */}
            {error && (
                <div className="rounded-xl bg-red-50 text-red-700 px-4 py-2 text-sm">
                    {error}
                </div>
            )}

            {/* PAY BUTTON */}
            <button
                disabled={!stripe || processing}
                onClick={handlePay}
                className="
                w-full flex items-center justify-center gap-2
                rounded-xl bg-rose-600 py-2.5
                text-white font-medium
                hover:bg-rose-700 transition
                disabled:opacity-50 cursor-pointer
            "
            >
                <Lock size={16} />
                {processing ? "Processing payment..." : `Pay $${amount} securely`}
            </button>

            {/* TRUST NOTE */}
            <p className="text-xs text-center text-slate-400">
                Payments are secured by Stripe
            </p>
        </div>
    );
}
