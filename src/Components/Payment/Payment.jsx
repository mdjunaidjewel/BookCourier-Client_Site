import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
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

const stripePromise = loadStripe("pk_test_XXXXXXXXXXXXXXXXXXXX"); // Frontend test key

// ----- Checkout Form -----
const CheckoutForm = ({ order }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);

    try {
      // 1️⃣ Create Payment Intent from backend
      const res = await fetch(
        "http://localhost:3000/api/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: order.price * 100 }), // cents
        }
      );

      const data = await res.json();
      if (!data.clientSecret) throw new Error("No clientSecret returned");

      // 2️⃣ Confirm Payment
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
        Swal.fire("Error", result.error.message, "error");
      } else if (result.paymentIntent?.status === "succeeded") {
        // 3️⃣ Update order status in backend
        await fetch(`http://localhost:3000/api/orders/${order._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentStatus: "paid", status: "completed" }),
        });

        Swal.fire("Success!", "Payment completed (test mode)", "success");
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form
      onSubmit={handlePayment}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">
        Pay for <span className="text-green-600">{order.bookTitle}</span>
      </h2>

      {/* Card Number */}
      <label className="block mb-1 font-semibold">Card Number</label>
      <div className="mb-4 p-2 border rounded">
        <CardNumberElement options={{ showIcon: true }} />
      </div>

      {/* Expiry & CVC */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block mb-1 font-semibold">Expiry</label>
          <div className="p-2 border rounded">
            <CardExpiryElement />
          </div>
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-semibold">CVC</label>
          <div className="p-2 border rounded">
            <CardCvcElement />
          </div>
        </div>
      </div>

      {/* Pay Button */}
      <button
        type="submit"
        disabled={processing}
        className={`w-full py-3 mt-4 text-white font-semibold rounded-lg transition ${
          processing
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {processing ? "Processing..." : `Pay $${order.price}`}
      </button>
    </form>
  );
};

// ----- Payment Page -----
const Payment = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/orders/${orderId}`);
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to load order", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading order...</p>;
  if (!order)
    return <p className="text-center mt-10 text-red-500">Order not found!</p>;

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm order={order} />
    </Elements>
  );
};

export default Payment;
