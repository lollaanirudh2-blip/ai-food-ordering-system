import { useState } from "react";
import { createOrder } from "../../api/orderApi";
import { mockPay } from "../../api/paymentApi";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "../../api/eventApi";
import Navbar from "../../components/common/Navbar";

export default function CheckoutPage() {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  const handleCreateOrder = async () => {
    try {
      const res = await createOrder();
      setOrder(res.data);
    } catch (error) {
      console.error("Failed to create order", error);
      alert("Failed to create order");
    }
  };

  const handlePayment = async () => {
  try {
    const res = await mockPay({ order_id: order.order_id });

    await trackEvent({
      event_type: "place_order",
      event_metadata: JSON.stringify({ order_id: order.order_id }),
    });

    navigate("/payment-success", {
      state: {
        order_id: res.data.order_id,
        transaction_id: res.data.transaction_id,
        payment_status: res.data.payment_status,
        order_status: res.data.order_status,
      },
    });
  } catch (error) {
    console.error("Payment failed", error);
    alert("Payment failed");
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Navbar />
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>

      {!order ? (
        <button
          onClick={handleCreateOrder}
          className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600"
        >
          Create Order
        </button>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow max-w-xl">
          <p className="mb-2">Order ID: {order.order_id}</p>
          <p className="mb-2">Total Amount: ₹{order.total_amount}</p>
          <p className="mb-2">Delivery Fee: ₹{order.delivery_fee}</p>
          <p className="mb-2">Tax: ₹{order.tax_amount}</p>
          <p className="text-xl font-bold mb-4">Final Amount: ₹{order.final_amount}</p>

          <button
            onClick={handlePayment}
            className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600"
          >
            Pay Now
          </button>
        </div>
      )}
    </div>
  );
}