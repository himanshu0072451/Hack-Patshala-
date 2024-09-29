import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const TeacherDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        // The token will be automatically included in the request if withCredentials is true
        const response = await axios.get(
          "http://localhost:5000/api/protected",
          { withCredentials: true }
        );
        setData(response.data);
      } catch (error) {
        setError("Error fetching protected data");
        console.error("Error fetching protected data:", error);
        // Handle unauthorized access or token expiration
        if (error.response && error.response.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProtectedData();
  }, []);

  const handleLogout = () => {
    Cookies.remove("token"); // Remove the cookie
    setTimeout(() => {
      navigate("/"); // Redirect to home page
    }, 1000);
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="main min-h-screen px-6 pt-[5rem]">
      <div className="content h-full w-full">
        <div className="top h-56 w-full flex items-center justify-between gap-6">
          <div className="left flex items-center gap-6">
            <div className="Userpfp h-40 w-40 rounded-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z2lybCUyMHByb2ZpbGUlMjBwaWN0dXJlfGVufDB8fDB8fHww"
                alt="PFP"
                className="h-full w-full object-cover object-center overflow-hidden"
              />
            </div>
            <div className="txt">
              <h1 className="text-3xl font-medium leading-none tracking-tight font-[Satoshi]">
                Alex Jhonson
              </h1>
              <h4 className="text-lg font-thin mt-[0.15rem] leading-none tracking-tight font-[Satoshi]">
                alex69@gmail.com
              </h4>
            </div>
          </div>
          <button className="text-base bg-white py-1 px-4 text-black font-[700] rounded-sm">
            Logout
          </button>
        </div>
        <div className="main-content h-full w-full font-[Satoshi]">
          <h1 className="text-2xl font-semibold">Quick Actions</h1>
          <div className="btns mt-5 flex items-center gap-4">
            <button className="text-base bg-white py-2 px-4 text-black font-[800] rounded-sm">
              Send Notification
            </button>
            <NavLink
              to="/upload-notes"
              className="text-base bg-white py-2 px-4 text-black font-[800] rounded-sm"
            >
              Upload Notes
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
