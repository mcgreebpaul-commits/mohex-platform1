import React from 'react';
import dynamic from 'next/dynamic';

const TradesClient = dynamic(() => import('./TradesClient'), { ssr: false });

export default function AdminTradesPage() {
  return (
    <React.Suspense fallback={<div className="p-8">Loading…</div>}>
      <TradesClient />
    </React.Suspense>
  );
}
