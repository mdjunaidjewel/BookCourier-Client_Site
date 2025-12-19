import { useContext, useState } from "react";
import { AuthContext } from "../Providers/AuthProvider";

const OrderModal = ({ book, close }) => {
  const { user } = useContext(AuthContext);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleOrder = () => {
    const order = {
      bookId: book._id,
      bookTitle: book.title,
      name: user.displayName,
      email: user.email,
      phone,
      address,
      status: "pending",
      paymentStatus: "unpaid",
    };

    fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    }).then(() => close());
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">বই অর্ডার করুন</h3>

        <input
          value={user.displayName}
          readOnly
          className="input input-bordered w-full mt-2"
        />
        <input
          value={user.email}
          readOnly
          className="input input-bordered w-full mt-2"
        />
        <input
          onChange={(e) => setPhone(e.target.value)}
          placeholder="ফোন নাম্বার"
          className="input input-bordered w-full mt-2"
        />
        <textarea
          onChange={(e) => setAddress(e.target.value)}
          placeholder="ঠিকানা"
          className="textarea textarea-bordered w-full mt-2"
        ></textarea>

        <div className="modal-action">
          <button onClick={handleOrder} className="btn btn-primary">
            Place Order
          </button>
          <button onClick={close} className="btn">
            বাতিল
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
