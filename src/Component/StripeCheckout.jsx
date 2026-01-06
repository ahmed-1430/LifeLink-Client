import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import API from "../api/axios";

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
            //  Create payment intent
            const intentRes = await API.post("/funds/create-intent", {
                amount: Number(amount),
            });

            const clientSecret = intentRes.data.clientSecret;

            //  Confirm card payment
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

            //  Save funding record
            await API.post("/funds", {
                amount: Number(amount),
                paymentId: result.paymentIntent.id,
            });

            onSuccess();
        } catch (err) {
            console.error(err);
            setError("Payment failed");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="border rounded-xl p-4 bg-slate-50">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: "16px",
                                color: "#0f172a",
                                "::placeholder": { color: "#94a3b8" },
                            },
                        },
                    }}
                />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
                disabled={!stripe || processing}
                onClick={handlePay}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-xl font-medium disabled:opacity-60"
            >
                {processing ? "Processing..." : `Pay $${amount}`}
            </button>
        </div>
    );
}
