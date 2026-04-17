import { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar";
import { getAnalyticsDashboard } from "../../api/analyticsApi";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState({
    summary: {
      total_orders: 0,
      total_revenue: 0,
      total_events: 0,
      total_users: 0,
    },
    top_ordered_items: [],
    top_event_types: [],
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getAnalyticsDashboard();
        setDashboard(res.data);
      } catch (error) {
        console.error("Failed to fetch analytics dashboard", error);
      }
    };

    fetchDashboard();
  }, []);

  const { summary, top_ordered_items, top_event_types } = dashboard;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Navbar />

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Overview of orders, revenue, user activity, and insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-sm text-gray-500">Total Orders</p>
          <h2 className="text-3xl font-bold mt-2">{summary.total_orders}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <h2 className="text-3xl font-bold mt-2">₹{summary.total_revenue}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-sm text-gray-500">Total Events</p>
          <h2 className="text-3xl font-bold mt-2">{summary.total_events}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-sm text-gray-500">Total Users</p>
          <h2 className="text-3xl font-bold mt-2">{summary.total_users}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Top Ordered Items</h2>

          {top_ordered_items.length === 0 ? (
            <p className="text-gray-500">No ordered items yet</p>
          ) : (
            <div className="space-y-3">
              {top_ordered_items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <span className="font-medium text-gray-800">
                    {item.item_name}
                  </span>
                  <span className="text-blue-600 font-semibold">
                    {item.total_quantity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Top Event Types</h2>

          {top_event_types.length === 0 ? (
            <p className="text-gray-500">No event data yet</p>
          ) : (
            <div className="space-y-3">
              {top_event_types.map((event, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <span className="font-medium text-gray-800">
                    {event.event_type}
                  </span>
                  <span className="text-green-600 font-semibold">
                    {event.total_count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}