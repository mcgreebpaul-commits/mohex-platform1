"use client";
import React, { useEffect, useState } from 'react';

export default function AdminDashboardPage() {
  const [pendingTrades, setPendingTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPending = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/trades/pending`, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          setPendingTrades(data || []);
        }
      } catch (err) {
        console.error('fetch pending trades error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin — Dashboard</h1>
      <p className="mb-4">Pending trades</p>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="space-y-4">
          {pendingTrades.length === 0 && <p>No pending trades</p>}
          {pendingTrades.map((t) => (
            <div key={t.id} className="p-4 border rounded">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">Trade #{t.id}</div>
                  <div className="text-sm text-gray-500">User: {t.user_id}</div>
                </div>
                <div>
                  <a href={`/admin/trades?id=${t.id}`} className="text-blue-600">Open</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
