import React, { useState } from 'react';
import { Copy, Check, Share2, MessageCircle, X } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  shareUrl: string;
  description?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  shareUrl,
  description = 'Check out this calculation on CalcHub!',
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`${title} - ${description}`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-up">
      <div className="w-full max-w-md p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 font-display font-bold text-lg">
            <Share2 className="w-5 h-5 text-indigo-400" />
            Share Calculation
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-3 text-sm text-slate-600 dark:text-zinc-400">
          Share this direct calculation with your colleagues, friends, or social media with all parameters pre-filled!
        </p>

        {/* Copy Link Input */}
        <div className="mt-4 flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="w-full bg-transparent text-xs font-mono text-slate-700 dark:text-zinc-300 outline-none px-2"
          />
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        {/* Social Share Buttons */}
        <div className="mt-6 flex items-center justify-around gap-2">
          {/* X / Twitter */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl text-xs text-slate-400 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-850 flex items-center justify-center hover:bg-indigo-500/20 hover:text-indigo-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            X (Twitter)
          </a>

          {/* WhatsApp */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl text-xs text-slate-400 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-850 flex items-center justify-center hover:bg-emerald-500/20 hover:text-emerald-400">
              <MessageCircle className="w-4 h-4" />
            </div>
            WhatsApp
          </a>

          {/* LinkedIn */}
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl text-xs text-slate-400 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-850 flex items-center justify-center hover:bg-blue-500/20 hover:text-blue-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </div>
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};
