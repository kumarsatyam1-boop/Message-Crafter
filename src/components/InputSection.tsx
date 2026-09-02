import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, RefreshCw, X, AlertCircle } from 'lucide-react';

interface InputSectionProps {
  rawInput: string;
  onChange: (val: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
}

const SAMPLE_PROMPTS = [
  {
    tag: 'Hinglish Renewal',
    text: 'Kal client se follow-up karna hai health insurance renewal quotation ke liye, please bata do discount valid hai Friday tak.',
  },
  {
    tag: 'Hindi Request',
    text: 'कृपया मुझे आज शाम तक मोटर इंश्योरेंस पॉलिसी डॉक्युमेंट्स की कॉपी ईमेल पर भेज दीजिए।',
  },
  {
    tag: 'Hinglish Leave',
    text: 'Manager ko bolna hai ki meri tabiyat kharab hai to kal work from home karunga aur meeting 3 baje attend karunga.',
  },
  {
    tag: 'Urgent Approval',
    text: 'Vendor contract finalize ho gaya hai, please 4 baje se pehle approval de dijiye taki onboarding start ho sake.',
  },
];

export const InputSection: React.FC<InputSectionProps> = ({
  rawInput,
  onChange,
  isLoading,
  onSubmit,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognitionLanguage, setRecognitionLanguage] = useState<'hi-IN' | 'en-IN' | 'en-US'>('hi-IN');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = recognitionLanguage;

      recognition.onstart = () => {
        setIsRecording(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript || interimTranscript) {
          // Append or update the text in the editable textarea
          onChange((prev) => {
            const trimmed = prev.trim();
            const space = trimmed.length > 0 ? ' ' : '';
            return `${trimmed}${space}${finalTranscript || interimTranscript}`;
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone access was denied. Please allow microphone permissions.');
        } else if (event.error === 'no-speech') {
          // No speech detected, keep open or retry
        } else {
          setSpeechError(`Voice input notice: ${event.error}`);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.error('Speech recognition initialization error:', err);
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [recognitionLanguage, onChange]);

  const toggleRecording = () => {
    if (!speechSupported) {
      alert('Speech Recognition is not supported by your browser. Please type your message or try Chrome/Edge.');
      return;
    }

    setSpeechError(null);

    if (isRecording) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      setIsRecording(false);
    } else {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = recognitionLanguage;
          recognitionRef.current.start();
          setIsRecording(true);
        }
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setSpeechError('Could not access microphone. Please ensure microphone permissions are granted.');
        setIsRecording(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (!isLoading && rawInput.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <span>6. Message Input (Hindi / Hinglish / English)</span>
        </label>

        {/* Voice controls & Language selector */}
        <div className="flex items-center gap-2">
          <select
            value={recognitionLanguage}
            onChange={(e) => {
              const newLang = e.target.value as any;
              setRecognitionLanguage(newLang);
              if (isRecording && recognitionRef.current) {
                recognitionRef.current.stop();
                setIsRecording(false);
              }
            }}
            disabled={isRecording}
            className="text-2xs bg-white border border-slate-200 text-slate-600 rounded-lg px-2 py-1 focus:outline-hidden focus:ring-1 focus:ring-[#00A86B]"
            title="Speech input language"
          >
            <option value="hi-IN">🎙️ Hindi / Hinglish (hi-IN)</option>
            <option value="en-IN">🎙️ Indian English (en-IN)</option>
            <option value="en-US">🎙️ US English (en-US)</option>
          </select>

          {/* Mic Record Button */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer ${
              isRecording
                ? 'bg-rose-500 border-rose-600 text-white animate-pulse shadow-sm'
                : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300 hover:text-[#00A86B] hover:bg-emerald-50/50'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-3.5 h-3.5" />
                <span>Recording... Stop</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5 text-[#00A86B]" />
                <span>Voice Input</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recording status indicator */}
      {isRecording && (
        <div className="flex items-center justify-between p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span className="font-medium">
              Listening... Speak in Hindi, Hinglish, or English. You can edit the text in real-time below.
            </span>
          </div>
          <button
            type="button"
            onClick={toggleRecording}
            className="text-xs font-bold text-rose-700 hover:text-rose-900 underline cursor-pointer"
          >
            Done
          </button>
        </div>
      )}

      {speechError && (
        <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{speechError}</span>
        </div>
      )}

      {/* Editable Text Area */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          rows={3}
          value={rawInput}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type or speak in plain Hindi, Hinglish, or English... (e.g. 'Kal meeting me decide karenge proposal accept karna hai ya nahi, please time pe aana')"
          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#00A86B] focus:border-[#00A86B] resize-y transition-all leading-relaxed shadow-2xs font-normal"
        />

        {/* Clear text button */}
        {rawInput && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-2.5 top-2.5 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            title="Clear text"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Helper prompts & Submit button row */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-2xs text-slate-400">
          <span>Quick samples:</span>
          <span>{rawInput.length} chars</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {SAMPLE_PROMPTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(sample.text)}
              className="text-2xs bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-600 hover:text-[#00A86B] px-2 py-0.5 rounded-md transition-colors cursor-pointer text-left"
            >
              <span className="font-semibold">{sample.tag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Frame Action */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading || !rawInput.trim()}
          className={`w-full py-2.5 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer ${
            isLoading || !rawInput.trim()
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              : 'bg-[#00A86B] hover:bg-[#00935D] text-white shadow-xs hover:shadow-sm active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Framing Plain English Message...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-100" />
              <span>Frame Message in Plain English</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
