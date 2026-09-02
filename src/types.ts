export type MessageChannel = 'whatsapp' | 'email';

export type ToneStyle =
  | 'professional'
  | 'polite'
  | 'casual'
  | 'urgent'
  | 'persuasive'
  | 'crisp'
  | 'empathetic'
  | 'warm_festive';

export type RecipientType =
  // Standard list
  | 'client'
  | 'manager'
  | 'colleague'
  | 'vendor'
  | 'customer'
  | 'policyholder'
  // Specific List
  | 'rm'
  | 'digital_partner'
  | 'circle_head'
  | 'sales_head'
  | 'insurance_partner'
  | 'insurer_zonal_head'
  | 'operations'
  | 'payouts_finance'
  | 'compliance'
  | 'claims_ops'
  | 'tech_it_support'
  | 'product_team'
  | 'other_stakeholder'
  | 'custom';

export type PurposeType =
  | 'follow_up'
  | 'project_update'
  | 'meeting_request'
  | 'query_support'
  | 'policy_renewal'
  | 'document_request'
  | 'approval_request'
  | 'welcome'
  | 'birthday_wish'
  | 'appreciation'
  | 'congratulations'
  | 'anniversary_wish'
  | 'festival_greetings'
  | 'thank_you'
  | 'custom';

export interface MessageFramingRequest {
  rawInput: string;
  channel: MessageChannel;
  recipient: RecipientType;
  recipientName?: string;
  recipientCustom?: string;
  purpose: PurposeType;
  purposeCustom?: string;
  tone: ToneStyle;
  deadline?: string;
  sourceLanguageHint?: 'auto' | 'hi' | 'hinglish' | 'en';
}

export interface MessageFramingResponse {
  subject?: string;
  framedMessage: string;
  channel: MessageChannel;
  detectedLanguage?: string;
  toneApplied: string;
}
