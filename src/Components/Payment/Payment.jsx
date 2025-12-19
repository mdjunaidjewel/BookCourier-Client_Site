import React, { useState, useEffect } from "react";
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

const stripePromise = loadStripe(
  "pk_test_51Sg40ALDih2MfrK38jgrynU8yyfT9FVczHCcJEa2A1Uz3dETRDoW0l2KlknksEIPUbz0bWZmdmtO2quj8FHx0Fl300ou8EPPcc"
);

const CheckoutForm = ({ order }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    try {
      // Create Payment Intent
      const res = await fetch(
        "http://localhost:3000/api/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: order.price * 100 }),
        }
      );
      const data = await res.json();

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: { name: order.name, email: order.email },
        },
      });

      if (result.error) {
        Swal.fire("Error", result.error.message, "error");
      } else if (result.paymentIntent.status === "succeeded") {
        // Update order
        await fetch(`http://localhost:3000/api/orders/${order._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentStatus: "paid", status: "completed" }),
        });
        Swal.fire("Success", "Payment completed!", "success").then(() => {
          navigate("/dashboard/orders");
        });
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
      className="max-w-lg w-full mx-auto bg-white shadow-xl rounded-xl p-8 mt-12 md:mt-20 transition hover:shadow-2xl"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Payment for <span className="text-cyan-600">{order.bookTitle}</span>
      </h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          Card Number
        </label>
        <div className="border rounded-lg p-3 bg-gray-50">
          <CardNumberElement className="w-full text-gray-800" />
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-gray-700 font-semibold mb-2">
            Expiry
          </label>
          <div className="border rounded-lg p-3 bg-gray-50">
            <CardExpiryElement className="w-full text-gray-800" />
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-gray-700 font-semibold mb-2">CVC</label>
          <div className="border rounded-lg p-3 bg-gray-50">
            <CardCvcElement className="w-full text-gray-800" />
          </div>
        </div>
      </div>

      <div className="mb-6 text-gray-700">
        <p>
          Amount: <span className="font-bold">${order.price}</span>
        </p>
        <p>
          Customer: <span className="font-medium">{order.name}</span>
        </p>
        <p>
          Email: <span className="font-medium">{order.email}</span>
        </p>
      </div>

      <button
        type="submit"
        disabled={processing}
        className={`w-full py-3 rounded-lg font-semibold text-white transition ${
          processing
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-cyan-600 hover:bg-cyan-700"
        }`}
      >
        {processing ? "Processing..." : `Pay $${order.price}`}
      </button>
    </form>
  );
};

const Payment = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (order) return;
    fetch(`http://localhost:3000/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .catch(() => Swal.fire("Error", "Failed to load order", "error"))
      .finally(() => setLoading(false));
  }, [orderId, order]);

  if (loading)
    return (
      <p className="text-center mt-20 text-lg text-gray-600">Loading...</p>
    );
  if (!order)
    return (
      <p className="text-center mt-20 text-red-500 text-lg">Order not found!</p>
    );

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm order={order} />
    </Elements>
  );
};

export default Payment;
