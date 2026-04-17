import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { getOrderById } from "../../api/orderApi";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(id);
        setOrder(res.data);
      } catch (error) {
        console.error("Failed to fetch order details", error);
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <Navbar />
        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Navbar />

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Order Details</h1>
        <p className="text-gray-500 mt-2">
          Full details of your placed order
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><span className="font-semibold">Order ID:</span> {order.id}</p>
          <p><span className="font-semibold">Status:</span> {order.status}</p>
          <p><span className="font-semibold">Payment:</span> {order.payment_status}</p>
          <p><span className="font-semibold">Created At:</span> {order.created_at}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Ordered Items</h2>

        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="border rounded-xl p-4 flex justify-between items-start"
            >
              <div>
                <h3 className="text-xl font-semibold">{item.item_name}</h3>
                <p className="text-gray-500 mt-1">Quantity: {item.quantity}</p>
                <p className="text-gray-500">Price: ₹{item.price_at_time}</p>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold">₹{item.subtotal}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Bill Summary</h2>

        <div className="space-y-2 text-lg">
          <p>
            <span className="font-medium">Items Total:</span> ₹{order.total_amount}
          </p>
          <p>
            <span className="font-medium">Delivery Fee:</span> ₹{order.delivery_fee}
          </p>
          <p>
            <span className="font-medium">Tax:</span> ₹{order.tax_amount}
          </p>
          <p className="text-2xl font-bold mt-4">
            Final Amount: ₹{order.final_amount}
          </p>
        </div>
      </div>
    </div>
  );
}