import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getHomeRecommendations,
  getInstantSuggestion,
  getTrendingRecommendations,
} from "../../api/recommendationApi";
import { addToCart } from "../../api/cartApi";
import Navbar from "../../components/common/Navbar";

export default function HomePage() {
  const [data, setData] = useState({
    predicted_for_you: [],
    recent_activity: [],
    time_based: [],
  });

  const [trendingItems, setTrendingItems] = useState([]);
  const [instantSuggestion, setInstantSuggestion] = useState(null);
  const [showSuggestion, setShowSuggestion] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning ☀️";
    if (hour < 18) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const [homeRes, trendingRes] = await Promise.all([
          getHomeRecommendations(),
          getTrendingRecommendations(),
        ]);

        setData(homeRes.data);
        setTrendingItems(trendingRes.data);
      } catch (error) {
        console.error("Failed to fetch recommendations", error);
      }
    };

    fetchRecommendations();
  }, []);

  const handleAddToCart = async (itemId) => {
    try {
      await addToCart({ menu_item_id: itemId, quantity: 1 });
      alert("Added to cart");
    } catch (error) {
      console.error("Failed to add item to cart", error);
      alert("Failed to add item to cart");
    }
  };

  const handleInstantSuggestion = async () => {
    try {
      const res = await getInstantSuggestion();

      if (res.data.message) {
        alert(res.data.message);
        return;
      }

      setInstantSuggestion(res.data);
      setShowSuggestion(true);
    } catch (error) {
      console.error("Failed to fetch instant suggestion", error);
      alert("Could not get suggestion right now");
    }
  };

  const renderSection = (title, items) => (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-500">Smart suggestions for you</span>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-gray-500">No items available right now</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={`${title}-${item.id}`}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300 border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-block">
                    AI Suggested
                  </p>
                  <h3 className="text-2xl font-semibold mt-4 text-gray-900">
                    {item.name}
                  </h3>
                </div>

                <span className="text-xs font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full">
                  {item.confidence || "Medium"} Confidence
                </span>
              </div>

              <p className="text-gray-500 mt-3">{item.description}</p>
              <p className="mt-3 text-sm text-gray-700">
                Category: <span className="font-medium">{item.category}</span>
              </p>
              <p className="mt-4 font-bold text-3xl text-gray-900">₹{item.price}</p>
              <p className="mt-3 text-sm text-blue-600 font-medium">{item.reason}</p>

              <button
                onClick={() => handleAddToCart(item.id)}
                className="mt-5 bg-green-500 text-white px-5 py-3 rounded-xl hover:bg-green-600 transition font-medium"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTrendingSection = (items) => (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-3xl font-bold text-gray-900">🔥 Trending Now</h2>
        <span className="text-sm text-gray-500">Popular among all users</span>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-gray-500">No trending items right now</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={`trending-${item.id}`}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300 border border-orange-100"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full inline-block">
                    Trending
                  </p>
                  <h3 className="text-2xl font-semibold mt-4 text-gray-900">
                    {item.name}
                  </h3>
                </div>

                <span className="text-xs font-medium text-red-700 bg-red-50 px-3 py-1 rounded-full">
                  Hot
                </span>
              </div>

              <p className="text-gray-500 mt-3">{item.description}</p>
              <p className="mt-3 text-sm text-gray-700">
                Category: <span className="font-medium">{item.category}</span>
              </p>
              <p className="mt-4 font-bold text-3xl text-gray-900">₹{item.price}</p>
              <p className="mt-3 text-sm text-orange-600 font-medium">{item.reason}</p>

              <button
                onClick={() => handleAddToCart(item.id)}
                className="mt-5 bg-orange-500 text-white px-5 py-3 rounded-xl hover:bg-orange-600 transition font-medium"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 px-8 py-8">
        <Navbar />
      <div className="bg-white rounded-3xl shadow-md p-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{getGreeting()}</h1>
            <p className="text-gray-500 mt-2 text-lg">
              Here’s what we think you’ll love today 🍽️
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleInstantSuggestion}
              className="bg-purple-500 text-white px-5 py-3 rounded-xl hover:bg-purple-600 transition font-medium"
            >
              What should I eat? 🤔
            </button>

            <Link
              to="/restaurants"
              className="bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition font-medium"
            >
              Browse Restaurants
            </Link>

            <Link
              to="/cart"
              className="bg-green-500 text-white px-5 py-3 rounded-xl hover:bg-green-600 transition font-medium"
            >
              Cart 🛒
            </Link>
          </div>
        </div>
      </div>

      {showSuggestion && instantSuggestion && (
        <div className="mb-10 bg-white rounded-3xl shadow-lg p-8 border-2 border-purple-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-purple-600 mb-2">
                AI Instant Suggestion
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                {instantSuggestion.name}
              </h2>
              <p className="text-gray-500 mt-2">{instantSuggestion.description}</p>
              <p className="mt-3 text-sm text-gray-700">
                Category:{" "}
                <span className="font-medium">{instantSuggestion.category}</span>
              </p>
              <p className="mt-4 text-lg font-medium text-blue-600">
                Why this? {instantSuggestion.reason}
              </p>
              <p className="mt-2 text-sm text-green-700">
                Confidence: {instantSuggestion.confidence || "Medium"}
              </p>

              <button
                onClick={() => handleAddToCart(instantSuggestion.id)}
                className="mt-5 bg-green-500 text-white px-5 py-3 rounded-xl hover:bg-green-600 transition font-medium"
              >
                Add to Cart
              </button>
            </div>

            <div className="text-right">
              <p className="text-4xl font-bold text-gray-900">
                ₹{instantSuggestion.price}
              </p>
              <button
                onClick={() => setShowSuggestion(false)}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700"
              >
                Close ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {renderSection("Predicted for You", data.predicted_for_you)}
      {renderSection("Based on Recent Activity", data.recent_activity)}
      {renderSection("Time-Based Suggestions", data.time_based)}
      {renderTrendingSection(trendingItems)}
    </div>
  );
}