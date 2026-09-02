import React, { useState } from 'react';
import { MessageFramingResponse, MessageChannel } from '../types';
import { Copy, Check, RotateCw, Sparkles, Mail, MessageSquare } from 'lucide-react';

interface OutputSectionProps {
  response: MessageFramingResponse | null;
  channel: MessageChannel;
  isLoading: boolean;
  onRegenerate: () => void;
}

export const OutputSection: React.FC<OutputSectionProps> = ({
  response,
  channel,
  isLoading,
  onRegenerate,
}) => {
  const [copied, setCopied] = useState(false);

  if (!response && !isLoading) {
    return (
      <div className="w-full h-full min-h-[320px] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100/60 flex items-center justify-center text-[#00A86B] mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-700">Ready to Frame Your Message</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
          Provide your thoughts in Hindi, Hinglish, or English via voice or text. Your polished, ready-to-send English message will appear here.
        </p>
      </div>
    );
  }

  if (isLoading && !response) {
    return (
      <div className="w-full min-h-[320px] rounded-2xl border border-slate-200 bg-white p-6 flex flex-col items-center justify-center text-center shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#00A86B] mb-3 animate-spin">
          <RotateCw className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Framing Your Message...</h3>
        <p className="text-xs text-slate-500 mt-1">
          Translating Hindi/Hinglish and applying your chosen tone & structure.
        </p>
      </div>
    );
  }

  if (!response) return null;

  const handleCopy = async () => {
    let textToCopy = response.framedMessage;
    if (response.channel === 'email' && response.subject) {
      textToCopy = `Subject: ${response.subject}\n\n${response.framedMessage}`;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for iframe / unsupported clipboard
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col">
      {/* Header bar */}
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {response.channel === 'email' ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Mail className="w-4 h-4 text-[#00A86B]" />
              <span>Framed Email Draft</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <MessageSquare className="w-4 h-4 text-[#00A86B]" />
              <span>Framed WhatsApp Message</span>
            </div>
          )}

          {response.detectedLanguage && (
            <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 border border-emerald-200/60">
              {response.detectedLanguage}
            </span>
          )}
        </div>

        <span className="text-2xs text-slate-400 capitalize">
          Tone: <strong className="text-slate-600 font-semibold">{response.toneApplied}</strong>
        </span>
      </div>

      {/* Message Content */}
      <div className="p-5 sm:p-6 space-y-4 flex-1">
        {/* If Email, show Subject Line Box */}
        {response.channel === 'email' && response.subject && (
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Subject Line
            </span>
            <div className="text-sm font-semibold text-slate-900 select-all">
              {response.subject}
            </div>
          </div>
        )}

        {/* Formatted Message Body */}
        <div className="relative">
          {response.channel === 'whatsapp' ? (
            <div className="bg-[#EFEAE2] p-4 rounded-xl border border-[#D1D7DB] relative">
              <div className="bg-white p-3.5 rounded-lg shadow-2xs border border-slate-100 max-w-full">
                <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed select-all font-sans">
                  {response.framedMessage}
                </p>
                <div className="flex justify-end items-center gap-1 mt-2 text-2xs text-slate-400">
                  <span>Just now</span>
                  <span className="text-[#00A86B]">✓✓</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Email Body
              </span>
              <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed select-all font-sans">
                {response.framedMessage}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer: ONLY Copy Response & Regenerate as strictly requested */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
        {/* Regenerate Button */}
        <button
          type="button"
          onClick={onRegenerate}
          disabled={isLoading}
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#00A86B]' : 'text-slate-500'}`} />
          <span>Regenerate</span>
        </button>

        {/* Copy Response Button */}
        <button
          type="button"
          onClick={handleCopy}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-[#00A86B] hover:bg-[#00935D] text-white'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Response</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
