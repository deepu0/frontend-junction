'use client';

import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

type CapturedItem = {
  id: string;
  title: string;
  original_url: string;
  status: string;
  quality_score: number | null;
  company: string | null;
  source: string;
  captured_at: string;
  ai_processed: boolean;
};

export default function CapturedDashboard() {
  const [items, setItems] = useState<CapturedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchItems = async () => {
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase
      .from('captured_content')
      .select(
        'id, title, original_url, status, quality_score, company, source, captured_at, ai_processed'
      )
      .order('captured_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const [actionMsg, setActionMsg] = React.useState<{
    id: string;
    msg: string;
    ok: boolean;
    link?: string | null;
  } | null>(null);

  const handleAction = async (id: string, action: string) => {
    setActionLoading(id);
    setActionMsg(null);

    const steps: Record<string, string[]> = {
      process: [
        '📤 Sending content to Gemini AI...',
        '🧠 AI is scoring & rewriting...',
        '✍️ Extracting company, rounds, questions...',
      ],
    };

    // Show cycling contextual messages during AI processing
    let stepIndex = 0;
    let stepTimer: ReturnType<typeof setInterval> | null = null;
    if (action === 'process' && steps.process) {
      setActionMsg({ id, msg: steps.process[0], ok: true });
      stepTimer = setInterval(() => {
        stepIndex = (stepIndex + 1) % steps.process.length;
        setActionMsg({ id, msg: steps.process[stepIndex], ok: true });
      }, 4000);
    }

    try {
      const res = await fetch('/api/pipeline/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      if (stepTimer) clearInterval(stepTimer);
      const data = await res.json();

      if (res.ok) {
        await fetchItems();
        if (action === 'process') {
          const scoreEmoji =
            data.score >= 8 ? '🚀' : data.score >= 7 ? '👀' : '❌';
          const statusLabel =
            data.status === 'published'
              ? 'Auto-published!'
              : data.status === 'review'
                ? 'Needs your review'
                : 'Rejected (low quality)';
          const link = data.slug ? `/interview-experience/${data.slug}` : null;
          setActionMsg({
            id,
            msg: `${scoreEmoji} Score ${data.score}/10 · ${statusLabel}${data.company ? ` · ${data.company}` : ''}`,
            ok: data.score >= 7,
            link,
          });
        } else {
          setActionMsg({ id, msg: `✅ ${data.message || 'Done'}`, ok: true });
        }
      } else {
        setActionMsg({ id, msg: `❌ ${data.error || 'Failed'}`, ok: false });
      }
    } catch (e: any) {
      if (stepTimer) clearInterval(stepTimer);
      setActionMsg({ id, msg: `❌ Network error: ${e.message}`, ok: false });
    }
    setActionLoading(null);
  };

  const statusColor: Record<string, string> = {
    queued: 'bg-yellow-500/20 text-yellow-500',
    processing: 'bg-blue-500/20 text-blue-500',
    review: 'bg-orange-500/20 text-orange-500',
    approved: 'bg-green-500/20 text-green-500',
    published: 'bg-emerald-500/20 text-emerald-500',
    rejected: 'bg-red-500/20 text-red-500',
  };

  if (loading)
    return (
      <div className='min-h-screen pt-24 flex items-center justify-center'>
        Loading...
      </div>
    );

  return (
    <div className='min-h-screen bg-background pt-24 pb-16'>
      <div className='container mx-auto px-4 max-w-5xl'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold'>Captured Content</h1>
            <p className='text-muted-foreground'>
              Extension & manual captures. Process individually or wait for
              cron.
            </p>
          </div>
          <div className='text-sm text-muted-foreground'>
            {items.filter((i) => i.status === 'queued').length} queued ·{' '}
            {items.filter((i) => i.status === 'published').length} published
          </div>
        </div>

        {items.length === 0 ? (
          <p className='text-center text-muted-foreground py-20'>
            No captured content yet. Use the extension or /admin/ingest to add.
          </p>
        ) : (
          <div className='space-y-3'>
            {items.map((item) => (
              <div
                key={item.id}
                className='rounded-xl border border-border bg-card overflow-hidden'
              >
                <div className='p-4 flex items-center gap-4'>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[item.status] || ''}`}
                      >
                        {item.status}
                      </span>
                      {item.quality_score && (
                        <span className='text-xs text-muted-foreground'>
                          ⭐ {item.quality_score}/10
                        </span>
                      )}
                      {item.company && (
                        <span className='text-xs text-muted-foreground'>
                          🏢 {item.company}
                        </span>
                      )}
                      <span className='text-xs text-muted-foreground'>
                        via {item.source}
                      </span>
                    </div>
                    <p className='font-medium truncate'>{item.title}</p>
                    <a
                      href={item.original_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-xs text-primary truncate block'
                    >
                      {item.original_url}
                    </a>
                  </div>

                  <div className='flex gap-2 shrink-0'>
                    {(item.status === 'queued' ||
                      item.status === 'rejected') && (
                      <button
                        type='button'
                        onClick={() => handleAction(item.id, 'process')}
                        disabled={actionLoading === item.id}
                        className='px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50'
                      >
                        {actionLoading === item.id
                          ? 'AI Processing...'
                          : '🤖 Process'}
                      </button>
                    )}
                    {item.status === 'published' && (
                      <button
                        type='button'
                        onClick={() => handleAction(item.id, 'process')}
                        disabled={actionLoading === item.id}
                        className='px-3 py-1.5 text-xs font-medium rounded-lg bg-violet-500 text-white hover:bg-violet-600 disabled:opacity-50'
                      >
                        {actionLoading === item.id
                          ? 'Rewriting...'
                          : '✨ Reprocess'}
                      </button>
                    )}
                    {item.status === 'review' && (
                      <button
                        type='button'
                        onClick={() => handleAction(item.id, 'publish')}
                        disabled={actionLoading === item.id}
                        className='px-3 py-1.5 text-xs font-medium rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50'
                      >
                        ✅ Publish
                      </button>
                    )}
                    {item.status !== 'rejected' &&
                      item.status !== 'published' && (
                        <button
                          type='button'
                          onClick={() => handleAction(item.id, 'reject')}
                          disabled={actionLoading === item.id}
                          className='px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 disabled:opacity-50'
                        >
                          ✕
                        </button>
                      )}
                  </div>
                </div>
                {actionMsg?.id === item.id && (
                  <div
                    className={`px-4 py-2 text-xs border-t border-border flex items-center gap-2 ${actionMsg.ok ? 'text-green-500 bg-green-500/5' : 'text-red-500 bg-red-500/5'}`}
                  >
                    <span>{actionMsg.msg}</span>
                    {actionMsg.link && (
                      <a
                        href={actionMsg.link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='underline font-medium hover:opacity-80'
                      >
                        View post →
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
