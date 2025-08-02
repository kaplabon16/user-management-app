import React from "react";

const UserTable = ({ users, selected, setSelected }) => {
  const toggleAll = (e) => {
    if (e.target.checked) {
      setSelected(users.map((u) => u.id));
    } else {
      setSelected([]);
    }
  };

  const toggleOne = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((i) => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  return (
    <div className="overflow-x-auto border rounded">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 w-8">
              <input
                type="checkbox"
                onChange={toggleAll}
                checked={selected.length === users.length && users.length > 0}
                title="Select All"
              />
            </th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Status</th>
            <th className="p-2">Last Login</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u.id}
              className="border-t hover:bg-gray-50 transition-all text-sm"
            >
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={selected.includes(u.id)}
                  onChange={() => toggleOne(u.id)}
                  title={`Select ${u.name}`}
                />
              </td>
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.status}</td>
              <td className="p-2">
                {u.last_login
                  ? new Date(u.last_login).toLocaleString()
                  : "Never"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
