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

// CheckoutForm
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
          body: JSON.stringify({ amount: order.price * 100 }), // convert $ to cents
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
          navigate("/dashboard");
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
      className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10"
    >
      <h2 className="text-xl font-bold mb-4">Pay for {order.bookTitle}</h2>
      <label>Card Number</label>
      <div className="border p-2 mb-2">
        <CardNumberElement />
      </div>
      <div className="flex gap-2 mb-2">
        <div className="flex-1">
          <label>Expiry</label>
          <div className="border p-2">
            <CardExpiryElement />
          </div>
        </div>
        <div className="flex-1">
          <label>CVC</label>
          <div className="border p-2">
            <CardCvcElement />
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        {processing ? "Processing..." : `Pay $${order.price}`}
      </button>
    </form>
  );
};

// Payment page
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

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!order)
    return <p className="text-center mt-10 text-red-500">Order not found!</p>;

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm order={order} />
    </Elements>
  );
};

export default Payment;
