import { useEffect, useState } from "react";
import API from "../../api/authApi";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      const res = await API.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data.user);
    };

    fetchUser();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome 🎉</h2>
        {user && (
          <p className="text-gray-600">Logged in as: {user.email}</p>
        )}
      </div>
    </div>
  );
}