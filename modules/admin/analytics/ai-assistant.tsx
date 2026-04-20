"use client";

import * as React from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export function AiAssistantView() {
  const [q, setQ] = React.useState("");
  const [answer, setAnswer] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const run = () => {
    if (!q.trim()) return;
    setBusy(true);
    setAnswer(null);
    window.setTimeout(() => {
      setAnswer(
        `Demo response (POST /api/analytics/ai-query): Based on last month’s snapshot, the lowest margin item was Diet Cola at ~12% margin. Chicken Karahi leads contribution margin. Ask in Roman Urdu or English — production will call Claude via Supabase Edge Function.`
      );
      setBusy(false);
    }, 600);
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-[#1a1a2e]">AI Lite assistant</h1>
        <p className="mt-1 text-sm font-medium text-[#a0a8b2]">
          <code className="font-mono text-[11px] font-bold text-[#1a1a2e]">POST /api/analytics/ai-query</code> — English / Urdu natural
          language on analytics snapshots.
        </p>
      </div>

      <div className="mx-auto max-w-2xl rounded-[36px] border border-[#EBEBF0] bg-[#1a1a2e] p-8 text-white shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
            <Sparkles className="text-pink-400" size={22} />
          </div>
          <div>
            <p className="text-lg font-black">Ask your data</p>
            <p className="text-[11px] text-white/40">Which item had the worst margin last month؟ / گزشتہ ماہ سب سے کم مارجن کون سا تھا؟</p>
          </div>
        </div>
        <textarea
          value={q}
          onChange={(e) => setQ(e.target.value)}
          rows={3}
          placeholder="Type a question…"
          className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-medium text-white outline-none placeholder:text-white/25"
        />
        <button
          type="button"
          disabled={busy}
          onClick={run}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f472b6] py-3.5 text-sm font-black text-white shadow-xl transition hover:bg-[#fb7185] disabled:opacity-50"
        >
          {busy ? "Thinking…" : "Run query"} <ArrowRight size={16} strokeWidth={3} />
        </button>
      </div>

      {answer && (
        <div className="mx-auto mt-6 max-w-2xl rounded-[28px] border border-[#EBEBF0] bg-white p-6 text-sm font-medium leading-relaxed text-[#1a1a2e] card-shadow">
          {answer}
        </div>
      )}
    </div>
  );
}
