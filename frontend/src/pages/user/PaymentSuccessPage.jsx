import { Link, useLocation } from "react-router-dom";
import Navbar from "../../components/common/Navbar";

export default function PaymentSuccessPage() {
  const location = useLocation();
  const paymentData = location.state;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Navbar />

      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-10 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Payment Successful
        </h1>
        <p className="text-gray-500 text-lg mb-8">
          Your order has been placed successfully
        </p>

        {paymentData ? (
          <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8">
            <p className="mb-2">
              <span className="font-semibold">Order ID:</span>{" "}
              {paymentData.order_id}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Transaction ID:</span>{" "}
              {paymentData.transaction_id}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Payment Status:</span>{" "}
              {paymentData.payment_status}
            </p>
            <p>
              <span className="font-semibold">Order Status:</span>{" "}
              {paymentData.order_status}
            </p>
          </div>
        ) : (
          <p className="text-gray-500 mb-8">No payment details available</p>
        )}

        <div className="flex justify-center gap-4">
          <Link
            to="/orders"
            className="bg-blue-500 text-white px-5 py-3 rounded-xl hover:bg-blue-600 transition"
          >
            View Orders
          </Link>

          <Link
            to="/home"
            className="bg-green-500 text-white px-5 py-3 rounded-xl hover:bg-green-600 transition"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}