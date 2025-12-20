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
import { AuthContext } from "../../Components/Providers/AuthContext/AuthProvider";

const stripePromise = loadStripe(
  "pk_test_51Sg40ALDih2MfrK38jgrynU8yyfT9FVczHCcJEa2A1Uz3dETRDoW0l2KlknksEIPUbz0bWZmdmtO2quj8FHx0Fl300ou8EPPcc"
);

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
      // Create Payment Intent
      const res = await fetch(
        "http://localhost:3000/api/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
          body: JSON.stringify({ amount: order.price * 100 }), // cents
        }
      );
      const data = await res.json();
      if (!data.clientSecret) throw new Error("Payment intent error");

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: { name: order.name, email: order.email },
        },
      });

      if (result.error) {
        Swal.fire("Error", result.error.message, "error");
      } else if (result.paymentIntent.status === "succeeded") {
        // Update order status
        await fetch(`http://localhost:3000/api/orders/${order._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
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
      className="max-w-lg mx-auto bg-white p-6 rounded shadow mt-12"
    >
      <h2 className="text-2xl font-bold mb-4">
        Pay ${order.price} for {order.bookTitle}
      </h2>
      <div className="mb-4">
        <label>Card Number</label>
        <div className="border p-2 rounded bg-gray-50">
          <CardNumberElement />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <div className="flex-1">
          <label>Expiry</label>
          <div className="border p-2 rounded bg-gray-50">
            <CardExpiryElement />
          </div>
        </div>
        <div className="flex-1">
          <label>CVC</label>
          <div className="border p-2 rounded bg-gray-50">
            <CardCvcElement />
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={processing}
        className={`w-full py-2 rounded text-white ${
          processing ? "bg-gray-400" : "bg-cyan-600 hover:bg-cyan-700"
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
  const { user } = useContext(AuthContext);
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

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!order)
    return <p className="text-center mt-20 text-red-500">Order not found!</p>;

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm order={order} user={user} />
    </Elements>
  );
};

export default Payment;
