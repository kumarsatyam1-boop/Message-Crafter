import React from 'react';
import { RecipientType, PurposeType, ToneStyle } from '../types';
import { User, Target, Sparkles, Clock, ChevronDown, UserCheck } from 'lucide-react';

interface ContextSelectorsProps {
  recipient: RecipientType;
  recipientName: string;
  recipientCustom: string;
  onRecipientChange: (r: RecipientType) => void;
  onRecipientNameChange: (val: string) => void;
  onRecipientCustomChange: (val: string) => void;

  purpose: PurposeType;
  purposeCustom: string;
  onPurposeChange: (p: PurposeType) => void;
  onPurposeCustomChange: (val: string) => void;

  tone: ToneStyle;
  onToneChange: (t: ToneStyle) => void;

  deadline: string;
  onDeadlineChange: (d: string) => void;
}

const STANDARD_RECIPIENTS: { id: RecipientType; label: string }[] = [
  { id: 'client', label: 'Client / Customer' },
  { id: 'manager', label: 'Manager / Team Lead' },
  { id: 'colleague', label: 'Colleague / Team Member' },
  { id: 'vendor', label: 'Vendor / Partner' },
  { id: 'policyholder', label: 'Policyholder' },
];

const SPECIFIC_RECIPIENTS: { id: RecipientType; label: string }[] = [
  { id: 'rm', label: 'RM (Relationship Manager)' },
  { id: 'digital_partner', label: 'Digital Partner (DP / POSP)' },
  { id: 'circle_head', label: 'Circle Head' },
  { id: 'sales_head', label: 'Sales Head' },
  { id: 'insurance_partner', label: 'Insurance Partner / AMC' },
  { id: 'insurer_zonal_head', label: 'Insurer Zonal Head' },
  { id: 'operations', label: 'Operations (Tanmay / Sumeet)' },
  { id: 'payouts_finance', label: 'Payouts & Finance (Hara)' },
  { id: 'compliance', label: 'Compliance (Shobhan)' },
  { id: 'claims_ops', label: 'Claims Operations Team' },
  { id: 'tech_it_support', label: 'Technology & IT Support' },
  { id: 'product_team', label: 'Product Team' },
  { id: 'other_stakeholder', label: 'Other Stakeholder' },
  { id: 'custom', label: 'Custom Stakeholder / Recipient...' },
];

const PURPOSE_GROUPS: { group: string; options: { id: PurposeType; label: string }[] }[] = [
  {
    group: 'Occasions & Wishes',
    options: [
      { id: 'welcome', label: '🎉 Welcome / Onboarding' },
      { id: 'birthday_wish', label: '🎂 Birthday Wish' },
      { id: 'appreciation', label: '🌟 Appreciation / Kudos' },
      { id: 'congratulations', label: '🏆 Congratulations (Milestone/Promotion)' },
      { id: 'anniversary_wish', label: '💐 Work / Personal Anniversary Wish' },
      { id: 'festival_greetings', label: '✨ Festive Greetings (Diwali/New Year/etc.)' },
      { id: 'thank_you', label: '🙏 Thank You Note' },
    ],
  },
  {
    group: 'Business & Operations',
    options: [
      { id: 'follow_up', label: '📌 Follow-up / Status Check-in' },
      { id: 'project_update', label: '📊 Project / Task Update' },
      { id: 'meeting_request', label: '📅 Meeting / Call Request' },
      { id: 'policy_renewal', label: '🛡️ Policy Renewal Reminder' },
      { id: 'document_request', label: '📁 Document / KYC Request' },
      { id: 'approval_request', label: '✅ Approval Request' },
      { id: 'query_support', label: '❓ Query / Support Escalation' },
      { id: 'custom', label: '✏️ Custom Purpose...' },
    ],
  },
];

const TONE_OPTIONS: { id: ToneStyle; label: string }[] = [
  { id: 'professional', label: 'Professional (Standard Business)' },
  { id: 'polite', label: 'Polite & Warm (Courteous)' },
  { id: 'warm_festive', label: 'Warm & Festive (Celebratory)' },
  { id: 'casual', label: 'Casual & Friendly (Informal)' },
  { id: 'urgent', label: 'Urgent & Action-Oriented' },
  { id: 'persuasive', label: 'Persuasive (Pitching)' },
  { id: 'crisp', label: 'Crisp & Minimalist (Short)' },
  { id: 'empathetic', label: 'Empathetic (Supportive)' },
];

export const ContextSelectors: React.FC<ContextSelectorsProps> = ({
  recipient,
  recipientName,
  recipientCustom,
  onRecipientChange,
  onRecipientNameChange,
  onRecipientCustomChange,
  purpose,
  purposeCustom,
  onPurposeChange,
  onPurposeCustomChange,
  tone,
  onToneChange,
  deadline,
  onDeadlineChange,
}) => {
  return (
    <div className="w-full space-y-3">
      {/* Row 1: Recipient Type & Recipient Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Recipient Dropdown with Specific List */}
        <div>
          <label className="flex items-center gap-1.5 text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            <User className="w-3.5 h-3.5 text-[#00A86B]" />
            <span>2. Recipient Role</span>
          </label>
          <div className="relative">
            <select
              value={recipient}
              onChange={(e) => onRecipientChange(e.target.value as RecipientType)}
              className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#00A86B] focus:border-[#00A86B] pr-8 cursor-pointer shadow-2xs"
            >
              <optgroup label="Standard Recipients">
                {STANDARD_RECIPIENTS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Specific List">
                {SPECIFIC_RECIPIENTS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {recipient === 'custom' && (
            <input
              type="text"
              placeholder="e.g. Senior Underwriter / Regional Broker"
              value={recipientCustom}
              onChange={(e) => onRecipientCustomChange(e.target.value)}
              className="mt-1.5 w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#00A86B]"
            />
          )}
        </div>

        {/* Recipient Name Field */}
        <div>
          <label className="flex items-center gap-1.5 text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            <UserCheck className="w-3.5 h-3.5 text-[#00A86B]" />
            <span>3. Name of Recipient (Optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Rahul Sharma / Sumeet / Team"
            value={recipientName}
            onChange={(e) => onRecipientNameChange(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#00A86B] focus:border-[#00A86B] shadow-2xs"
          />
        </div>
      </div>

      {/* Row 2: Purpose & Tone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Purpose Selector */}
        <div>
          <label className="flex items-center gap-1.5 text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            <Target className="w-3.5 h-3.5 text-[#00A86B]" />
            <span>4. Purpose / Occasion</span>
          </label>
          <div className="relative">
            <select
              value={purpose}
              onChange={(e) => onPurposeChange(e.target.value as PurposeType)}
              className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#00A86B] focus:border-[#00A86B] pr-8 cursor-pointer shadow-2xs"
            >
              {PURPOSE_GROUPS.map((grp) => (
                <optgroup key={grp.group} label={grp.group}>
                  {grp.options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {purpose === 'custom' && (
            <input
              type="text"
              placeholder="e.g. Health Insurance claim status inquiry"
              value={purposeCustom}
              onChange={(e) => onPurposeCustomChange(e.target.value)}
              className="mt-1.5 w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#00A86B]"
            />
          )}
        </div>

        {/* Tone & Style */}
        <div>
          <label className="flex items-center gap-1.5 text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#00A86B]" />
            <span>5. Tone & Style</span>
          </label>
          <div className="relative">
            <select
              value={tone}
              onChange={(e) => onToneChange(e.target.value as ToneStyle)}
              className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#00A86B] focus:border-[#00A86B] pr-8 cursor-pointer shadow-2xs"
            >
              {TONE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Row 3: Deadline (Optional) */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="flex items-center gap-1.5 text-2xs font-bold text-slate-700 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-[#00A86B]" />
            <span>6. Specific Deadline (Optional)</span>
          </label>
          {deadline && (
            <button
              type="button"
              onClick={() => onDeadlineChange('')}
              className="text-2xs text-slate-400 hover:text-slate-600 underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Today EOD, Friday 5 PM, or 15th Oct"
            value={deadline}
            onChange={(e) => onDeadlineChange(e.target.value)}
            className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#00A86B] focus:border-[#00A86B] shadow-2xs"
          />
          <div className="hidden sm:flex items-center gap-1">
            {['Today EOD', 'Tomorrow 12 PM', 'By Friday', 'Urgent'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onDeadlineChange(preset)}
                className={`text-2xs px-2 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  deadline === preset
                    ? 'bg-emerald-50 border-[#00A86B] text-[#00A86B] font-semibold'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
