import Anthropic from '@anthropic-ai/sdk';
import type { Business } from '@/lib/supabase/types';
import { SITE, CHATBOT } from '@/lib/config/site';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ── Chatbot ────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// System prompt is built from site config — no hardcoded brand values here
const CHATBOT_SYSTEM = `You are ${CHATBOT.name}, ${CHATBOT.persona} for ${SITE.name}. You help users:
- Find the right peptide business category (brands, clinics, compounding pharmacies, research labs, wholesale suppliers, manufacturers)
- Navigate the ${SITE.name} directory
- Understand what peptide services and products are available in their area across the US and Canada

Keep answers concise (2-3 sentences max).

IMPORTANT: If a user is frustrated, upset, complaining, has a technical issue, an account problem, a billing question, or asks about something you truly cannot help with, always respond kindly AND include this exactly: "For direct help, email us at ${SITE.supportEmail} — we usually respond within 24 hours!"

Never invent specific business details, prices, or hours of operation. Do not provide medical advice.`;

export async function chatWithSylvita(messages: ChatMessage[]): Promise<string> {
  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 400,
    system: CHATBOT_SYSTEM,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const block = response.content[0];
  return block.type === 'text' ? block.text : '';
}

// ── Long Description Generation (500-800 words) ──────────────────────────

interface LongDescriptionResult {
  long_description_en: string;
}

export async function generateLongDescription(
  business: Partial<Business>
): Promise<LongDescriptionResult> {
  const prompt = `You are writing a detailed, SEO-optimized business description for ${SITE.name} — a peptide industry directory serving the US and Canada.

Business: "${business.name}"
City: ${business.city}, ${business.province}
Category: ${business.category}
${business.subcategory ? `Subcategory: ${business.subcategory}` : ''}
${business.description_en ? `Short description: ${business.description_en}` : ''}
${business.keywords && business.keywords.length > 0 ? `Keywords: ${business.keywords.join(', ')}` : ''}

Write a comprehensive business description (500-800 words):
- Professional, authoritative, SEO-friendly tone appropriate for the peptide industry
- Highlight what makes this business special and why customers or researchers should choose it
- Include natural keyword usage for local SEO
- Mention the city naturally
- Use paragraphs, not bullet points
- Do not make medical claims or provide medical advice

IMPORTANT: Write at least 500 words. Be thorough and detailed.

Respond in this exact JSON format:
{
  "long_description_en": "..."
}`;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}';

  try {
    return JSON.parse(text) as LongDescriptionResult;
  } catch {
    return {
      long_description_en: '',
    };
  }
}

// ── Short Description Generator (for claim form "Let Sylvita write it") ──────

interface ShortDescriptionResult {
  description: string;
}

export async function generateShortDescription(input: {
  name: string;
  city: string;
  category: string;
  subcategory?: string;
  website?: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  linkedin?: string;
  google_maps_url?: string;
  keywords?: string;
}): Promise<ShortDescriptionResult> {
  const socialSignals = [
    input.instagram && `Instagram: @${input.instagram.replace('@', '')}`,
    input.tiktok && `TikTok: @${input.tiktok.replace('@', '')}`,
    input.facebook && `Facebook: ${input.facebook}`,
    input.linkedin && `LinkedIn: ${input.linkedin}`,
  ].filter(Boolean).join('\n');

  const prompt = `You are ${CHATBOT.name}, a helpful content writer for ${SITE.name} — a peptide industry directory serving the US and Canada.

Write a short, engaging business description (3-5 sentences) for this listing:

Business name: ${input.name}
City: ${input.city}
Category: ${input.category}${input.subcategory ? `\nSubcategory: ${input.subcategory}` : ''}${input.website ? `\nWebsite: ${input.website}` : ''}${input.google_maps_url ? `\nGoogle Maps listing: ${input.google_maps_url}` : ''}${socialSignals ? `\nSocial media:\n${socialSignals}` : ''}${input.keywords ? `\nKeywords/tags: ${input.keywords}` : ''}

Guidelines:
- Professional, authoritative tone appropriate for the peptide industry
- Highlight what makes this business special and why customers or researchers should contact them
- Naturally mention the city for local SEO
- 3-5 sentences, no bullet points
- Write in English only
- Do NOT invent specific hours, prices, or facts not provided
- Do not make medical claims or provide medical advice

Respond with ONLY the description text — no labels, no JSON, no extra commentary.`;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text.trim() : '';
  return { description: text };
}

// ── Business AI Enrichment ─────────────────────────────────────────────────

interface EnrichmentResult {
  description_en: string;
  tags: string[];
}

export async function enrichBusiness(
  business: Partial<Business>
): Promise<EnrichmentResult> {
  const prompt = `You are enriching a peptide industry directory listing for: "${business.name}" in ${business.city}, ${business.province}.
Category: ${business.category}

Write a SHORT business description (2-3 sentences) in English — professional, authoritative, highlights what makes this business stand out in the peptide industry.

Also suggest 3-5 relevant tags (comma-separated, lowercase).

Respond in this exact JSON format:
{
  "description_en": "...",
  "tags": ["tag1", "tag2"]
}`;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}';

  try {
    return JSON.parse(text) as EnrichmentResult;
  } catch {
    return {
      description_en: `${business.name} is a peptide industry business serving customers in ${business.city}.`,
      tags: [],
    };
  }
}
