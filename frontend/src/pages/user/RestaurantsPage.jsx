import { useEffect, useState } from "react";
import { getRestaurants, searchRestaurants } from "../../api/restaurantApi";
import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await getRestaurants();
      setRestaurants(res.data);
    } catch (error) {
      console.error("Failed to fetch restaurants", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleSearch = async () => {
    try {
      if (!searchText.trim()) {
        fetchRestaurants();
        return;
      }

      setLoading(true);
      const res = await searchRestaurants(searchText);
      setRestaurants(res.data);
    } catch (error) {
      console.error("Failed to search restaurants", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchText("");
    fetchRestaurants();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Navbar />

      {/* 🔥 Header + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Restaurants</h1>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search restaurants, cuisine, location..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="border border-gray-300 rounded-xl px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <button
            onClick={handleSearch}
            className="bg-purple-500 text-white px-5 py-2 rounded-xl hover:bg-purple-600 transition"
          >
            Search
          </button>

          <button
            onClick={handleClearSearch}
            className="bg-gray-300 text-black px-4 py-2 rounded-xl hover:bg-gray-400 transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* 🔥 Loading */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      )}

      {/* 🔥 Empty State */}
      {!loading && restaurants.length === 0 && (
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <p className="text-gray-500">No restaurants found</p>
        </div>
      )}

      {/* 🔥 Restaurant List */}
      {!loading && restaurants.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              to={`/restaurants/${restaurant.id}`}
              className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">{restaurant.name}</h2>

              <p className="text-gray-600 mt-2">{restaurant.cuisine}</p>

              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {restaurant.description}
              </p>

              <div className="flex justify-between mt-4 text-sm">
                <span>⭐ {restaurant.rating}</span>
                <span>{restaurant.delivery_time_minutes} mins</span>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                📍 {restaurant.location}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}