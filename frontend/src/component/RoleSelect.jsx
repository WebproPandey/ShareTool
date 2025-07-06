// ✅ FILE: src/components/RoleSelect.jsx
import React from 'react';

export default function RoleSelect({ setRole }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-700 to-indigo-800 text-white">
      <h1 className="text-2xl font-semibold mb-6">Select Your Role</h1>
      <div className="space-x-6">
        <button
          onClick={() => setRole("sender")}
          className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-full shadow-lg text-lg"
        >
          Send 📤
        </button>
        <button
          onClick={() => setRole("receiver")}
          className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-full shadow-lg text-lg"
        >
          Receive 📥
        </button>
      </div>
    </div>
  );
}
