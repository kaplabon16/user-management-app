import React, { useEffect, useState } from "react";
import api from "../utils/api";
import UserTable from "../components/UserTable";
import Toolbar from "../components/Toolbar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [statusMsg, setStatusMsg] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = async (action) => {
    try {
      await api.post(`/users/${action}`, { ids: selected });
      setStatusMsg(`${action} successful`);
      setSelected([]);
      fetchUsers();
    } catch (err) {
      setStatusMsg(`Failed to ${action}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">User Management</h1>
        <button
          onClick={handleLogout}
          className="text-red-500 underline text-sm"
        >
          Logout
        </button>
      </div>

      {statusMsg && (
        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded mb-4">
          {statusMsg}
        </div>
      )}

      <Toolbar onAction={handleAction} disabled={selected.length === 0} />

      <UserTable
        users={users}
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  );
};

export default Dashboard;
