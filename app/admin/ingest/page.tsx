'use client';

import { useState } from 'react';

export default function IngestPage() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !content) { setStatus({ msg: 'URL and content are required', type: 'error' }); return; }
    if (content.length < 200) { setStatus({ msg: 'Content too short (min 200 chars)', type: 'error' }); return; }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/pipeline/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-capture-key': process.env.NEXT_PUBLIC_CAPTURE_SECRET || '' },
        body: JSON.stringify({ url, title: title || 'Untitled', content, source: 'manual', capturedAt: new Date().toISOString() }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ msg: '\u2705 ' + (data.message || 'Captured!'), type: 'success' });
        setUrl(''); setTitle(''); setContent('');
      } else {
        setStatus({ msg: '\u274c ' + (data.error || 'Failed'), type: 'error' });
      }
    } catch (err: any) {
      setStatus({ msg: '\u274c ' + err.message, type: 'error' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Ingest Experience</h1>
        <p className="text-muted-foreground mb-8">Paste interview experience content to process via AI pipeline.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Source URL *</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://medium.com/..."
              className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Google Frontend Interview Experience"
              className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content * <span className="text-muted-foreground">({content.length} chars)</span></label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste the interview experience text here..."
              rows={16}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground font-mono text-sm resize-y"
              required
            />
          </div>

          {status && (
            <div className={`p-3 rounded-lg text-sm ${status.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              {status.msg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Capture & Queue for Processing'}
          </button>
        </form>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Queued → AI processes every 6hrs → Score 8+ auto-publishes, 7 goes to review, below 7 rejected.
        </p>
      </div>
    </div>
  );
}
