/**
 * Netlify Function: Consent-Log (Einwilligungsnachweis)
 * POST /.netlify/functions/consent-log
 * Speichert Cookie-Einwilligung in Supabase (oder leitet an VPS weiter).
 *
 * Umgebungsvariablen in Netlify:
 * - SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY → Speicherung in Supabase
 * - ODER CONSENT_LOG_FORWARD_URL → Weiterleitung an dein Backend (z. B. VPS)
 */

import { createClient } from '@supabase/supabase-js';

type ConsentPayload = {
	consentId?: string;
	consentTimestamp?: string;
	lastConsentTimestamp?: string;
	acceptType?: string;
	acceptedCategories?: string[];
	rejectedCategories?: string[];
	languageCode?: string;
	revision?: number;
	url?: string;
};

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'Content-Type',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export default async (req: Request): Promise<Response> => {
	if (req.method === 'OPTIONS') {
		return new Response(null, { status: 204, headers: corsHeaders });
	}

	if (req.method !== 'POST') {
		return new Response(JSON.stringify({ error: 'Method not allowed' }), {
			status: 405,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	}

	let payload: ConsentPayload;
	try {
		payload = (await req.json()) as ConsentPayload;
	} catch {
		return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
			status: 400,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	}

	if (!payload.consentId || !payload.consentTimestamp) {
		return new Response(JSON.stringify({ error: 'consentId and consentTimestamp required' }), {
			status: 400,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	}

	const forwardUrl = process.env.CONSENT_LOG_FORWARD_URL;
	const supabaseUrl = process.env.SUPABASE_URL;
	const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

	// Option 1: Weiterleitung an eigenes Backend (z. B. VPS)
	if (forwardUrl) {
		try {
			const res = await fetch(forwardUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			if (!res.ok) throw new Error(`Forward failed: ${res.status}`);
		} catch (e) {
			console.error('Consent log forward error:', e);
			return new Response(JSON.stringify({ error: 'Forward failed' }), {
				status: 502,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			});
		}
		return new Response(JSON.stringify({ ok: true }), {
			status: 200,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	}

	// Option 2: Speicherung in Supabase
	if (supabaseUrl && supabaseKey) {
		const supabase = createClient(supabaseUrl, supabaseKey);
		const { error } = await supabase.from('consent_log').insert({
			consent_id: payload.consentId,
			consent_timestamp: payload.consentTimestamp,
			last_consent_timestamp: payload.lastConsentTimestamp ?? payload.consentTimestamp,
			accept_type: payload.acceptType ?? 'custom',
			accepted_categories: payload.acceptedCategories ?? [],
			rejected_categories: payload.rejectedCategories ?? [],
			language_code: payload.languageCode ?? 'de',
			revision: payload.revision ?? 0,
			url: payload.url ?? null,
		});
		if (error) {
			console.error('Supabase consent_log insert error:', error);
			return new Response(JSON.stringify({ error: 'Storage failed' }), {
				status: 500,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			});
		}
		return new Response(JSON.stringify({ ok: true }), {
			status: 200,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	}

	return new Response(
		JSON.stringify({ error: 'Configure SUPABASE_* or CONSENT_LOG_FORWARD_URL in Netlify' }),
		{
			status: 503,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		}
	);
};
