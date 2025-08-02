import React from "react";
import { Trash2, Ban, Unlock } from "lucide-react";

const Toolbar = ({ onAction, disabled }) => {
  return (
    <div className="flex gap-2 items-center mb-4">
      <button
        onClick={() => onAction("block")}
        disabled={disabled}
        className={`bg-yellow-500 text-white px-3 py-1 rounded ${
          disabled && "opacity-50 cursor-not-allowed"
        }`}
        title="Block selected users"
      >
        Block
      </button>
      <button
        onClick={() => onAction("unblock")}
        disabled={disabled}
        className={`text-green-600 hover:text-green-800`}
        title="Unblock selected users"
      >
        <Unlock size={20} />
      </button>
      <button
        onClick={() => onAction("delete")}
        disabled={disabled}
        className={`text-red-600 hover:text-red-800`}
        title="Delete selected users"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default Toolbar;
