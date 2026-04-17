import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { getOrders, reorderOrder } from "../../api/orderApi";
import { trackEvent } from "../../api/eventApi";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrders();
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Navbar />

      <h2 className="text-3xl font-bold mb-6">Your Orders</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-5 rounded-2xl shadow">
            <p className="font-semibold">Order ID: {order.id}</p>
            <p>Final Amount: ₹{order.final_amount}</p>
            <p>Status: {order.status}</p>
            <p>Payment: {order.payment_status}</p>

            <div className="flex gap-3 mt-4">
              <Link
                to={`/orders/${order.id}`}
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
              >
                View Details
              </Link>

              <button
                onClick={async () => {
                  await reorderOrder(order.id);

                  await trackEvent({
                    event_type: "reorder",
                    event_metadata: JSON.stringify({ order_id: order.id }),
                  });

                  navigate("/cart");
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Reorder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}