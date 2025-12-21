import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import { AuthContext } from "../Providers/AuthContext/AuthProvider";

const stripePromise = loadStripe(
  "pk_test_51Sg40ALDih2MfrK38jgrynU8yyfT9FVczHCcJEa2A1Uz3dETRDoW0l2KlknksEIPUbz0bWZmdmtO2quj8FHx0Fl300ou8EPPcc"
);

const cardStyle = {
  style: {
    base: {
      fontSize: "16px",
      color: "#374151",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: { color: "#dc2626" },
  },
};

const CheckoutForm = ({ order, user }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(
        "https://bookscourier.vercel.app/api/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: order.price * 100 }),
        }
      );

      const data = await res.json();
      if (!data.clientSecret)
        throw new Error(data.error || "Payment intent error");

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: order.name,
            email: order.email,
          },
        },
      });

      if (result.error) {
        Swal.fire("Payment Failed", result.error.message, "error");
      } else if (result.paymentIntent?.status === "succeeded") {
        await fetch(`https://bookscourier.vercel.app/api/orders/${order._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentStatus: "paid",
            status: "completed",
          }),
        });

        Swal.fire(
          "Success 🎉",
          "Payment completed successfully!",
          "success"
        ).then(() => navigate("/dashboard/orders"));
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center px-4">
      <form
        onSubmit={handlePayment}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border"
      >
        {/* Header */}
        <h2 className="text-3xl font-bold text-center text-cyan-700 mb-2">
          Secure Payment
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Your payment is protected by Stripe 🔒
        </p>

        {/* Order Summary */}
        <div className="bg-cyan-50 rounded-xl p-4 mb-6 border">
          <p className="font-semibold text-gray-700">
            {order.bookId?.title || "Book Purchase"}
          </p>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-gray-500">Total Amount</span>
            <span className="font-bold text-cyan-700">${order.price}</span>
          </div>
        </div>

        {/* Card Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Card Number
            </label>
            <div className="border rounded-xl p-3 bg-gray-50">
              <CardNumberElement options={cardStyle} />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Expiry Date
              </label>
              <div className="border rounded-xl p-3 bg-gray-50">
                <CardExpiryElement options={cardStyle} />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                CVC
              </label>
              <div className="border rounded-xl p-3 bg-gray-50">
                <CardCvcElement options={cardStyle} />
              </div>
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <button
          type="submit"
          disabled={processing}
          className={`mt-6 w-full py-3 rounded-xl text-white font-semibold transition cursor-pointer ${
            processing ? "bg-gray-400" : "bg-cyan-600 hover:bg-cyan-700"
          }`}
        >
          {processing ? "Processing..." : `Pay $${order.price}`}
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Powered by Stripe • PCI-DSS Compliant
        </p>
      </form>
    </div>
  );
};

const Payment = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (order || !user) return;

    const fetchOrder = async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch(
          `https://bookscourier.vercel.app/api/orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to load order");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        Swal.fire("Error", "Failed to load order", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, order, user]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-cyan-600"></span>
      </div>
    );

  if (!order)
    return (
      <p className="text-center mt-20 text-red-500 font-semibold">
        Order not found!
      </p>
    );

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm order={order} user={user} />
    </Elements>
  );
};

export default Payment;
