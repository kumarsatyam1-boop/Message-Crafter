import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI client lazily or safely with User-Agent header
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback message generator for offline or key-missing scenarios
function generateFallbackMessage(body: any) {
  const { rawInput, channel, recipient, recipientCustom, purpose, purposeCustom, tone, deadline } = body;
  const recipientName = recipientCustom || (recipient === 'manager' ? 'Manager' : recipient === 'client' ? 'Client' : recipient === 'colleague' ? 'Team Member' : 'Recipient');
  const targetTone = tone || 'professional';
  const targetPurpose = purposeCustom || purpose || 'General Update';
  const hasDeadline = deadline && deadline.trim().length > 0;

  let cleaned = (rawInput || '').trim();
  // Basic Hinglish/Hindi clean-up if plain English fallback
  cleaned = cleaned.replace(/\b(kripya|kripya karke|please)\b/gi, 'Please');
  cleaned = cleaned.replace(/\b(kal|tomorrow)\b/gi, 'tomorrow');
  cleaned = cleaned.replace(/\b(aaj|today)\b/gi, 'today');

  if (channel === 'email') {
    const subject = `${targetPurpose.charAt(0).toUpperCase() + targetPurpose.slice(1).replace(/_/g, ' ')} - Important Update${hasDeadline ? ` (Due: ${deadline})` : ''}`;
    let emailBody = `Dear ${recipientName},\n\nI hope this email finds you well.\n\n`;
    emailBody += `Regarding our discussion on ${targetPurpose.replace(/_/g, ' ')}: ${cleaned}\n\n`;
    if (hasDeadline) {
      emailBody += `Please note the deadline for this request is ${deadline}.\n\n`;
    }
    emailBody += `Kindly let me know if you need any further information or clarification.\n\nBest regards,\nTurtlemint Team`;
    return {
      subject,
      framedMessage: emailBody,
      channel: 'email',
      detectedLanguage: 'Hinglish / English',
      toneApplied: targetTone,
    };
  } else {
    let waMsg = `Hi ${recipientName},\n\n${cleaned}`;
    if (hasDeadline) {
      waMsg += `\n\n⏰ Deadline: ${deadline}`;
    }
    waMsg += `\n\nPlease let me know if you have any questions. Thanks!`;
    return {
      framedMessage: waMsg,
      channel: 'whatsapp',
      detectedLanguage: 'Hinglish / English',
      toneApplied: targetTone,
    };
  }
}

// API endpoint to frame messages
app.post('/api/frame-message', async (req: Request, res: Response) => {
  try {
    const {
      rawInput,
      channel = 'whatsapp',
      recipient = 'client',
      recipientName,
      recipientCustom,
      purpose = 'follow_up',
      purposeCustom,
      tone = 'professional',
      deadline,
      sourceLanguageHint,
    } = req.body;

    if (!rawInput || typeof rawInput !== 'string' || !rawInput.trim()) {
      return res.status(400).json({ error: 'Input message text is required.' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      const fallback = generateFallbackMessage(req.body);
      return res.json(fallback);
    }

    const recipientRoleMap: Record<string, string> = {
      rm: 'Relationship Manager (RM)',
      digital_partner: 'Digital Partner (DP / POSP)',
      circle_head: 'Circle Head',
      sales_head: 'Sales Head',
      insurance_partner: 'Insurance Partner / AMC',
      insurer_zonal_head: 'Insurer Zonal Head',
      operations: 'Operations (Tanmay / Sumeet)',
      payouts_finance: 'Payouts & Finance (Hara)',
      compliance: 'Compliance (Shobhan)',
      claims_ops: 'Claims Operations Team',
      tech_it_support: 'Technology & IT Support',
      product_team: 'Product Team',
      other_stakeholder: 'Other Stakeholder',
      client: 'Client / Customer',
      manager: 'Manager / Team Lead',
      colleague: 'Colleague / Team Member',
      vendor: 'Vendor / Partner',
      policyholder: 'Policyholder',
    };

    const recipientRoleLabel = recipientCustom || recipientRoleMap[recipient] || recipient;
    const recipientDisplayName = recipientName && recipientName.trim() ? recipientName.trim() : recipientRoleLabel;
    const purposeLabel = purposeCustom ? purposeCustom : purpose;
    const deadlineText = deadline && deadline.trim() ? deadline.trim() : 'No specific deadline specified';

    const systemInstruction = `You are Turtlemint's official Communication Assistant. Your role is to convert raw speech transcripts, thoughts, and messages in Hindi, Hinglish (Hindi written in English alphabets like "maine quote bhej diya hai check kar lo"), or broken English into crisp, professional, high-impact plain English messages.

Directives:
1. Translate Hindi / Hinglish into natural, fluent English while preserving the original intent, warmth, or urgency.
2. Adapt to the Recipient Context:
   - Recipient Role: ${recipientRoleLabel}
   - Recipient Name: ${recipientName ? recipientName.trim() : 'Not explicitly specified'}
   - If a recipient name is provided, address them politely by name (e.g. "Hi ${recipientName}," or "Dear ${recipientName},").
3. Adapt to the Purpose / Occasion (${purposeLabel}):
   - Handle celebratory occasions (Welcome, Birthday Wish, Appreciation, Congratulations, Anniversary Wish, Festive Greetings) with appropriate warmth and enthusiasm.
   - Handle operational/business tasks (Follow-up, Project Update, Policy Renewal, Document Request, Approval Request, Query Escalation) with structured clarity.
4. Channel Formatting:
   - "whatsapp": Punchy, mobile chat style, clean paragraph breaks, bold formatting with asterisks (*bold*) where helpful, friendly tone.
   - "email": Complete email with a compelling "subject" line, proper salutation, clear body paragraphs, actionable deadline/call to action, and professional closing (e.g. "Best regards,\\n[Your Name] / Turtlemint Team").
5. Strictly apply requested Tone: ${tone}.`;

    const prompt = `Channel: ${channel}
Recipient Role: ${recipientRoleLabel}
Recipient Name: ${recipientDisplayName}
Purpose / Occasion: ${purposeLabel}
Desired Tone: ${tone}
Deadline: ${deadlineText}
Source Language Hint: ${sourceLanguageHint || 'auto-detect'}

User's Raw Input (may be Hindi / Hinglish / English):
"""
${rawInput.trim()}
"""

Provide the output formatted properly according to the JSON schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.4,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: {
              type: Type.STRING,
              description: 'Email subject line (required if channel is email, otherwise empty)',
            },
            framedMessage: {
              type: Type.STRING,
              description: 'The complete framed message in plain English ready to send.',
            },
            detectedLanguage: {
              type: Type.STRING,
              description: 'Detected language (e.g. Hindi, Hinglish, English, or Mixed)',
            },
            toneApplied: {
              type: Type.STRING,
              description: 'Brief description of tone applied',
            },
          },
          required: ['framedMessage'],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from model');
    }

    const parsed = JSON.parse(responseText);
    return res.json({
      subject: parsed.subject || (channel === 'email' ? 'Important Update' : undefined),
      framedMessage: parsed.framedMessage,
      channel,
      detectedLanguage: parsed.detectedLanguage || 'Auto-detected',
      toneApplied: parsed.toneApplied || tone,
    });
  } catch (error: any) {
    console.error('Error in /api/frame-message:', error);
    // Return structured fallback rather than crashing
    try {
      const fallback = generateFallbackMessage(req.body);
      return res.json(fallback);
    } catch (fallbackError) {
      return res.status(500).json({ error: 'Failed to frame message. Please try again.' });
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Turtlemint Message Crafter server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
