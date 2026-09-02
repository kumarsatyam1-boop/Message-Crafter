import React from 'react';
import { MessageChannel } from '../types';
import { MessageSquare, Mail, Check } from 'lucide-react';

interface ChannelSelectorProps {
  selectedChannel: MessageChannel;
  onChange: (channel: MessageChannel) => void;
}

export const ChannelSelector: React.FC<ChannelSelectorProps> = ({
  selectedChannel,
  onChange,
}) => {
  return (
    <div className="w-full">
      <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
        1. Select Message Format
      </label>
      <div className="grid grid-cols-2 gap-2.5">
        {/* WhatsApp Option */}
        <button
          type="button"
          onClick={() => onChange('whatsapp')}
          className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
            selectedChannel === 'whatsapp'
              ? 'bg-emerald-50/80 border-[#00A86B] text-emerald-950 shadow-2xs ring-1 ring-[#00A86B]'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              selectedChannel === 'whatsapp'
                ? 'bg-[#00A86B] text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">WhatsApp</span>
              {selectedChannel === 'whatsapp' && (
                <Check className="w-3.5 h-3.5 text-[#00A86B]" />
              )}
            </div>
            <p className="text-2xs text-slate-500 truncate">
              Punchy chat format
            </p>
          </div>
        </button>

        {/* Email Option */}
        <button
          type="button"
          onClick={() => onChange('email')}
          className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
            selectedChannel === 'email'
              ? 'bg-emerald-50/80 border-[#00A86B] text-emerald-950 shadow-2xs ring-1 ring-[#00A86B]'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              selectedChannel === 'email'
                ? 'bg-[#00A86B] text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Mail className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">Email</span>
              {selectedChannel === 'email' && (
                <Check className="w-3.5 h-3.5 text-[#00A86B]" />
              )}
            </div>
            <p className="text-2xs text-slate-500 truncate">
              Subject & formal body
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
