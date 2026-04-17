import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getRestaurantById } from "../../api/restaurantApi";
import { getMenuByRestaurantId } from "../../api/menuApi";
import { addToCart } from "../../api/cartApi";
import { trackEvent } from "../../api/eventApi";
import Navbar from "../../components/common/Navbar";

export default function RestaurantDetailsPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restaurantRes = await getRestaurantById(id);
        const menuRes = await getMenuByRestaurantId(id);

        setRestaurant(restaurantRes.data);
        setMenu(menuRes.data);
        await trackEvent({
        event_type: "view_restaurant",
        restaurant_id: Number(id),
      });
      } catch (error) {
        console.error("Failed to fetch restaurant details", error);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = async (itemId) => {
    try {
      await addToCart({ menu_item_id: itemId, quantity: 1 });
      await trackEvent({
      event_type: "add_to_cart",
      restaurant_id: Number(id),
      menu_item_id: itemId,
    });
      alert("Item added to cart");
    } catch (error) {
      console.error("Failed to add item to cart", error);
      alert("Failed to add item to cart");
    }
  };

  if (!restaurant) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Navbar />
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold">{restaurant.name}</h1>
        <p className="text-gray-600 mt-2">{restaurant.cuisine}</p>
        <p className="text-gray-500 mt-2">{restaurant.description}</p>
        <div className="flex gap-6 mt-4 text-sm">
          <span>⭐ {restaurant.rating}</span>
          <span>{restaurant.delivery_time_minutes} mins</span>
          <span>{restaurant.location}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Menu</h2>

        <Link
          to="/cart"
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Go to Cart 🛒
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menu.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                <p className="text-sm mt-2">Category: {item.category}</p>
                <p className="text-sm">Spice: {item.spice_level || "N/A"}</p>

                <button
                  onClick={() => handleAddToCart(item.id)}
                  className="mt-3 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                >
                  Add to Cart
                </button>
              </div>

              <div className="text-right">
                <p className="font-bold text-lg">₹{item.price}</p>
                <p className="text-sm mt-1">
                  {item.is_veg ? "🟢 Veg" : "🔴 Non-Veg"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}