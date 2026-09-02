import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ChannelSelector } from './components/ChannelSelector';
import { ContextSelectors } from './components/ContextSelectors';
import { InputSection } from './components/InputSection';
import { OutputSection } from './components/OutputSection';
import {
  MessageChannel,
  RecipientType,
  PurposeType,
  ToneStyle,
  MessageFramingResponse,
} from './types';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [channel, setChannel] = useState<MessageChannel>('whatsapp');
  const [recipient, setRecipient] = useState<RecipientType>('client');
  const [recipientName, setRecipientName] = useState<string>('');
  const [recipientCustom, setRecipientCustom] = useState<string>('');
  const [purpose, setPurpose] = useState<PurposeType>('follow_up');
  const [purposeCustom, setPurposeCustom] = useState<string>('');
  const [tone, setTone] = useState<ToneStyle>('professional');
  const [deadline, setDeadline] = useState<string>('');
  const [rawInput, setRawInput] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<MessageFramingResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFrameMessage = useCallback(async () => {
    if (!rawInput.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/frame-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rawInput: rawInput.trim(),
          channel,
          recipient,
          recipientName: recipientName.trim() || undefined,
          recipientCustom: recipient === 'custom' ? recipientCustom : undefined,
          purpose,
          purposeCustom: purpose === 'custom' ? purposeCustom : undefined,
          tone,
          deadline: deadline.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to frame message.');
      }

      const data: MessageFramingResponse = await res.json();
      setResponse(data);
    } catch (err: any) {
      console.error('Framing error:', err);
      setErrorMessage(err.message || 'An error occurred while framing the message.');
    } finally {
      setIsLoading(false);
    }
  }, [rawInput, channel, recipient, recipientName, recipientCustom, purpose, purposeCustom, tone, deadline]);

  return (
    <div className="min-h-screen lg:h-screen bg-[#F8FAFC] flex flex-col font-sans lg:overflow-hidden">
      {/* Top Navbar with Turtlemint Logo */}
      <Header />

      {/* Main Content Area - Single Screen on PC with Output on Right */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-3 sm:px-5 py-3 lg:py-4 flex flex-col min-h-0">
        {/* Global Error Banner if any */}
        {errorMessage && (
          <div className="mb-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-xs shrink-0">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <div className="flex-1">
              <strong className="font-semibold">Notice:</strong> {errorMessage}
            </div>
          </div>
        )}

        {/* 2-Column Responsive Workspace: Output always on Right for PC */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 flex-1 min-h-0 items-stretch">
          {/* Left Column: Form Controls (7 cols on PC) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 lg:p-5 shadow-2xs flex flex-col justify-between space-y-3 overflow-y-auto">
            {/* 1. Format: WhatsApp vs Email */}
            <ChannelSelector
              selectedChannel={channel}
              onChange={(newChannel) => setChannel(newChannel)}
            />

            <hr className="border-slate-100" />

            {/* 2, 3, 4, 5, 6. Recipient, Recipient Name, Purpose, Tone, Deadline */}
            <ContextSelectors
              recipient={recipient}
              recipientName={recipientName}
              recipientCustom={recipientCustom}
              onRecipientChange={setRecipient}
              onRecipientNameChange={setRecipientName}
              onRecipientCustomChange={setRecipientCustom}
              purpose={purpose}
              purposeCustom={purposeCustom}
              onPurposeChange={setPurpose}
              onPurposeCustomChange={setPurposeCustom}
              tone={tone}
              onToneChange={setTone}
              deadline={deadline}
              onDeadlineChange={setDeadline}
            />

            <hr className="border-slate-100" />

            {/* 7. Text / Voice Input & Submission */}
            <InputSection
              rawInput={rawInput}
              onChange={(val) => setRawInput(val)}
              isLoading={isLoading}
              onSubmit={handleFrameMessage}
            />
          </div>

          {/* Right Column: Framed Output (5 cols on PC) */}
          <div className="lg:col-span-5 flex flex-col min-h-0 bg-white border border-slate-200 rounded-2xl p-4 lg:p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 shrink-0">
              <span className="text-2xs font-bold text-slate-700 uppercase tracking-wider">
                Framed Output (Plain English)
              </span>
              {response && (
                <span className="text-2xs font-medium text-[#00A86B] bg-emerald-50 px-2 py-0.5 rounded-full">
                  Ready to copy
                </span>
              )}
            </div>

            <div className="flex-1 min-h-0 pt-3 flex flex-col overflow-y-auto">
              <OutputSection
                response={response}
                channel={channel}
                isLoading={isLoading}
                onRegenerate={handleFrameMessage}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
