// frontend/src/components/AlertsList.jsx
import React from "react";

export default function AlertsList({ alerts = [], onResolve }) {
  return (
    <div className="space-y-3">
      {alerts.map(a => (
        <div key={a._id} className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
          <div className="flex justify-between">
            <div>
              <div className="font-semibold">{a.type}</div>
              <div className="text-sm">{a.message}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-sm text-blue-600" onClick={()=>onResolve(a._id)}>Resolve</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
