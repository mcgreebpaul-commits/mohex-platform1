"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type Trade = {
  id: number;
  user_id: number;
  market: string;
  amount: number;
  status: string;
};

export default function TradesClient() {
  const params = useSearchParams();
  const tradeId = params.get('id');

  const [trade, setTrade] = useState<Trade | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'win' | 'loss'>('win');
  const [percentage, setPercentage] = useState<number>(50);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!tradeId) return;
    const fetchTrade = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/trades/${tradeId}`, {
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          setTrade(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrade();
  }, [tradeId]);

  const handleSimulate = async () => {
    if (!tradeId) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/trades/${tradeId}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result: mode, percentage })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || 'simulate failed');
      alert('Simulated: ' + JSON.stringify(json));
    } catch (err: any) {
      console.error(err);
      alert('Error: ' + (err.message || 'unknown'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin — Trade</h1>
      {!tradeId && <p>Select a trade from the dashboard.</p>}
      {loading && <p>Loading trade…</p>}
      {trade && (
        <div className="space-y-4">
          <div className="p-4 border rounded">
            <div>Trade ID: {trade.id}</div>
            <div>User: {trade.user_id}</div>
            <div>Market: {trade.market}</div>
            <div>Amount: {trade.amount}</div>
            <div>Status: {trade.status}</div>
          </div>

          <div className="p-4 border rounded">
            <div className="mb-2 font-semibold">Simulate outcome</div>
            <div className="flex items-center gap-4 mb-2">
              <label className="flex items-center gap-2">
                <input type="radio" name="mode" checked={mode === 'win'} onChange={() => setMode('win')} />
                Win
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="mode" checked={mode === 'loss'} onChange={() => setMode('loss')} />
                Loss
              </label>
            </div>

            <div className="mb-2">
              <label className="block">Percentage: {percentage}%</label>
              <input type="range" min={1} max={100} value={percentage} onChange={(e) => setPercentage(Number(e.target.value))} />
            </div>

            <div>
              <button disabled={submitting} onClick={handleSimulate} className="px-4 py-2 bg-blue-600 text-white rounded">
                {submitting ? 'Submitting…' : 'Simulate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
