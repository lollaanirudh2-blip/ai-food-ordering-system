import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCart,
  removeCartItem,
  increaseCartItem,
  decreaseCartItem,
} from "../../api/cartApi";
import { trackEvent } from "../../api/eventApi";
import Navbar from "../../components/common/Navbar";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Navbar />
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

      {cart.length === 0 ? (
        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-600">Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-2xl shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <p className="text-gray-500 mt-1">{item.description}</p>
                    <p className="mt-2 text-sm">
                      {item.is_veg ? "🟢 Veg" : "🔴 Non-Veg"}
                    </p>

                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={async () => {
                          await decreaseCartItem(item.id);

                          await trackEvent({
                            event_type: "decrease_quantity",
                            menu_item_id: item.menu_item_id,
                          });

                          fetchCart();
                        }}
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                      >
                        -
                      </button>

                      <span className="font-medium">{item.quantity}</span>

                      <button
                        onClick={async () => {
                          await increaseCartItem(item.id);

                          await trackEvent({
                            event_type: "increase_quantity",
                            menu_item_id: item.menu_item_id,
                          });

                          fetchCart();
                        }}
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>

                    <p className="mt-3 font-medium">Subtotal: ₹{item.subtotal}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold">₹{item.price}</p>

                    <button
                      onClick={async () => {
                        await removeCartItem(item.id);

                        await trackEvent({
                          event_type: "remove_from_cart",
                          menu_item_id: item.menu_item_id,
                        });

                        fetchCart();
                      }}
                      className="bg-red-500 text-white px-3 py-1 mt-4 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-white p-5 rounded-2xl shadow">
            <h3 className="text-2xl font-bold">Total: ₹{totalAmount}</h3>

            <div className="mt-4">
              <Link
                to="/checkout"
                className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}