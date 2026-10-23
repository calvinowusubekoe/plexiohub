import type { Config } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { runKeepAlive } from '../../src/lib/keepAlive';

// Self-contained on purpose: the app's server modules import `server-only`, which throws outside Next.js.
const keepAlive = async () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const result = await runKeepAlive({
    ping: async () => {
      if (!url || !key) throw new Error('Supabase env vars are missing');
      const { error } = await createClient(url, key, { auth: { persistSession: false } }).from('faqs').select('id').limit(1);
      if (error) throw new Error(error.message);
    },
    sendEmail: async (msg) => {
      const apiKey = process.env.RESEND_API_KEY;
      const to = process.env.ADMIN_EMAIL;
      if (!apiKey || !to) throw new Error('Email is not configured');
      const from = process.env.RESEND_FROM || 'PlexioHub <onboarding@resend.dev>';
      const { error } = await new Resend(apiKey).emails.send({ from, to, ...msg });
      if (error) throw new Error(error.message);
    },
  });

  console.log('[keep-alive]', JSON.stringify(result));
  return new Response(JSON.stringify(result), { status: result.ok ? 200 : 500, headers: { 'content-type': 'application/json' } });
};

export default keepAlive;

export const config: Config = { schedule: '@daily' };
