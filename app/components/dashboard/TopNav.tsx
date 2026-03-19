"use client";

export default function TopNav() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          🔔
        </button>
        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
          U
        </div>
      </div>
    </header>
  );
}
