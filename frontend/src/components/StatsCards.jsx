// frontend/src/components/StatsCards.jsx
import React from "react";

export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <div className="bg-googleGreen p-4 rounded text-white">
        <div className="text-xs">Stock Value</div>
        <div className="text-lg font-bold">₦{(stats?.stockValue || 0).toFixed(2)}</div>
      </div>
      <div className="bg-googleYellow p-4 rounded">
        <div className="text-xs">Total Sales</div>
        <div className="text-lg font-bold">₦{(stats?.totalSales?.totalValue || 0).toFixed(2)}</div>
      </div>
      <div className="bg-googleBlue p-4 rounded text-white">
        <div className="text-xs">Total Purchases</div>
        <div className="text-lg font-bold">₦{(stats?.totalPurchases?.totalValue || 0).toFixed(2)}</div>
      </div>
      <div className="bg-white p-4 rounded border">
        <div className="text-xs">Low Stock</div>
        <div className="text-lg font-bold">{stats?.lowCount || 0}</div>
      </div>
    </div>
  );
}
