import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";
import { Resend } from "npm:resend@2.0.0";

// Helper function to detect Lovable preview environments
function isLovablePreview(origin?: string): boolean {
  return !!origin && (
    origin.endsWith('.lovable.dev') ||
    origin.endsWith('.lovable.app') ||
    origin.includes('lovableproject.com')
  );
}

// Dynamic CSP builder based on environment
function buildCSP(origin?: string): string {
  const baseCSP = {
    "default-src": "'self'",
    "script-src": "'self'",
    "style-src": "'self' 'unsafe-inline'",
    "img-src": "'self' data: blob:",
    "font-src": "'self'",
    "connect-src": "'self' https://*.supabase.co https://bewerbungsmensch.de https://www.bewerbungsmensch.de",
    "frame-ancestors": "'none'",
    "object-src": "'none'",
    "base-uri": "'self'",
    "form-action": "'self'",
    "upgrade-insecure-requests": ""
  };

  // Allow Lovable editor scripts in preview environments only
  if (isLovablePreview(origin)) {
    baseCSP["script-src"] += " https://cdn.gpteng.co";
    baseCSP["connect-src"] += ` ${origin} https://cdn.gpteng.co`;
  }

  return Object.entries(baseCSP)
    .map(([directive, value]) => `${directive} ${value}`)
    .join('; ')
    .trim();
}

// Dynamic security headers
function getSecurityHeaders(origin?: string) {
  return {
    'Content-Security-Policy': buildCSP(origin),
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Content-Type-Options': 'nosniff',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
}

// Dynamic CORS headers with origin validation
function getCorsHeaders(origin?: string) {
  const securityHeaders = getSecurityHeaders(origin);
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Vary': 'Origin',
    ...securityHeaders,
  };
}

// Secure CORS for GDPR compliance - restrict to authorized domains only
const allowedOrigins = [
  'https://bewerbungsmensch.de',
  'https://www.bewerbungsmensch.de',
  'http://localhost:3000',
  'http://localhost:5173',
  // Keep preview domain for development
  'https://542cf94b-6c9e-4ab7-93f7-aaeacf7a41b9.sandbox.lovable.dev'
];

// Initialize clients
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resendApiKey = Deno.env.get('RESEND_API_KEY');
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const SITE_URL = 'https://bewerbungsmensch.de';
const ADMIN_PASS = Deno.env.get('ADMIN_PASS');

// Enhanced CORS validation - secure allowlist with dynamic preview support
function validateCORS(origin: string | null): boolean {
  if (!origin) return false;
  
  // Check static allowlist
  if (allowedOrigins.includes(origin)) return true;
  
  // Check Lovable preview pattern (for development)
  if (isLovablePreview(origin)) return true;
  
  console.warn(`CORS rejected: ${origin}`);
  return false;
}

// Client IP extraction with multiple fallbacks
function getClientIP(req: Request): string {
  const headers = req.headers;
  return headers.get('cf-connecting-ip') ||
         headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
         headers.get('x-real-ip') ||
         'unknown';
}

// Safe filename sanitization
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .slice(0, 100);
}

// PDF file detection
function isPDFFile(buffer: ArrayBuffer): boolean {
  const uint8Array = new Uint8Array(buffer);
  const header = Array.from(uint8Array.slice(0, 4))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
  return header === '25504446'; // %PDF in hex
}

// Safe email sending with enhanced error handling
async function sendMailSafe({ to, subject, text, html }: { to: string | string[]; subject: string; text?: string; html?: string; }) {
  if (!resend) {
    console.error('Resend not configured');
    return { ok: false, error: 'Email service not configured' };
  }

  try {
    const recipients = Array.isArray(to) ? to : [to];
    console.log(`Attempting to send email to: ${recipients.join(', ')}`);
    
    const result = await resend.emails.send({
      from: 'Marcel <onboarding@resend.dev>',
      to: recipients,
      subject,
      text,
      html,
    });

    console.log(`Email send result:`, JSON.stringify(result));
    return { ok: true, result };
  } catch (error) {
    console.error(`Email send error:`, error);
    return { ok: false, error: (error as Error).message };
  }
}

// Main handler
const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get('origin');
  
  // Validate origin early
  if (origin && !validateCORS(origin)) {
    return new Response('CORS policy violation', { status: 403 });
  }

  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Route: POST /uploads/create-signed
  if (req.method === 'POST' && req.url.includes('/uploads/create-signed')) {
    try {
      const { filename, fileSize, userEmail } = await req.json();
      
      if (!filename || !fileSize || !userEmail) {
        return new Response(JSON.stringify({ error: 'Filename, fileSize und userEmail sind erforderlich' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // File size limit: 20MB
      if (fileSize > 20 * 1024 * 1024) {
        return new Response(JSON.stringify({ error: 'Datei zu groß (max. 20 MB)' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const sanitizedFilename = sanitizeFilename(filename);
      const timestamp = Date.now();
      const randomId = crypto.randomUUID().substring(0, 8);
      const storagePath = `${timestamp}_${randomId}_${sanitizedFilename}`;

      const { data, error } = await supabase.storage
        .from('cv_uploads')
        .createSignedUploadUrl(storagePath, {
          upsert: false,
        });

      if (error) {
        console.error('Error creating signed URL:', error);
        return new Response(JSON.stringify({ error: 'Fehler beim Erstellen der Upload-URL' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({
        signedUrl: data.signedUrl,
        path: storagePath,
        token: data.token
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error in create-signed:', error);
      return new Response(JSON.stringify({ error: 'Interner Serverfehler' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  // Route: POST /uploads/confirm
  if (req.method === 'POST' && req.url.includes('/uploads/confirm')) {
    try {
      const { path, userEmail, originalFilename, fileSize } = await req.json();
      
      if (!path || !userEmail || !originalFilename) {
        return new Response(JSON.stringify({ error: 'Path, userEmail und originalFilename sind erforderlich' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Download file to verify it's a valid PDF
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('cv_uploads')
        .download(path);

      if (downloadError) {
        console.error('Error downloading file for verification:', downloadError);
        return new Response(JSON.stringify({ error: 'Datei konnte nicht verifiziert werden' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const buffer = await fileData.arrayBuffer();
      if (!isPDFFile(buffer)) {
        // Delete invalid file
        await supabase.storage.from('cv_uploads').remove([path]);
        return new Response(JSON.stringify({ error: 'Nur PDF-Dateien sind erlaubt' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Calculate SHA256 hash
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const sha256Hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Insert metadata into database
      const { error: insertError } = await supabase
        .from('uploads')
        .insert({
          storage_path: path,
          original_filename: originalFilename,
          size_bytes: fileSize,
          sha256_hash: sha256Hash,
          user_email: userEmail,
          created_by_ip: getClientIP(req),
        });

      if (insertError) {
        console.error('Error inserting upload metadata:', insertError);
        return new Response(JSON.stringify({ error: 'Fehler beim Speichern der Metadaten' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error in confirm:', error);
      return new Response(JSON.stringify({ error: 'Interner Serverfehler' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  // Route: POST /requests/create
  if (req.method === 'POST' && req.url.includes('/requests/create')) {
    try {
      const { name, email, discord_name, message, cv_path } = await req.json();
      
      if (!name?.trim() || !email?.trim() || !message?.trim()) {
        return new Response(JSON.stringify({ error: 'Name, E-Mail und Nachricht sind erforderlich' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Insert request into database
      const { error } = await supabase
        .from('help_requests')
        .insert({
          name: name.trim(),
          email: email.trim(),
          discord_name: discord_name?.trim() || '',
          message: message.trim(),
          cv_path: cv_path || null,
        });

      if (error) {
        console.error('Error creating help request:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Send confirmation emails
      const userMail = await sendMailSafe({
        to: email,
        subject: 'Bestätigung deiner Bewerbungshilfe-Anfrage',
        html: `
          <h1>Anfrage erhalten!</h1>
          <p>Hallo ${name},</p>
          <p>vielen Dank für deine Anfrage zur Bewerbungshilfe. Ich habe sie erhalten und melde mich zeitnah bei dir.</p>
          <p>Viele Grüße<br>Marcel</p>
          <hr>
          <small>Hinweis: Verarbeitung gemäß Datenschutzerklärung. Auftragsverarbeiter: Supabase (EU-Region) und Resend (E-Mail).</small>
        `,
      });

      const adminMail = await sendMailSafe({
        to: 'marcel.welk@bewerbungsmensch.de',
        subject: 'Neue Bewerbungshilfe-Anfrage',
        html: `
          <h1>Neue Anfrage</h1>
          <p>Neue Bewerbungshilfe-Anfrage von:</p>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>E-Mail:</strong> ${email}</li>
            ${discord_name ? `<li><strong>Discord:</strong> ${discord_name}</li>` : ''}
            ${cv_path ? `<li><strong>CV hochgeladen:</strong> Ja</li>` : ''}
          </ul>
          <h3>Nachricht:</h3>
          <blockquote style="border-left: 3px solid #0066cc; padding-left: 16px; margin: 16px 0;">${message}</blockquote>
        `,
      });

      const mailStatus = (userMail.ok && adminMail.ok) ? 'sent' : 'not_sent';

      if (mailStatus === 'not_sent') {
        console.error(`[REQUEST-EMAIL-ERROR] Email failed - User: ${JSON.stringify(userMail)}, Admin: ${JSON.stringify(adminMail)}`);
      } else {
        console.log(`[REQUEST-EMAIL-SUCCESS] Both emails sent successfully for request from ${email}`);
      }

      return new Response(
        JSON.stringify({ success: true, mail: mailStatus }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Error processing request:', error);
      return new Response(
        JSON.stringify({ error: 'Interner Serverfehler' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  // Route: GET /diagnostics/email?to=<address>&key=<ADMIN_PASS>
  if (req.method === 'GET' && req.url.includes('/diagnostics/email')) {
    const urlObj = new URL(req.url);
    const to = urlObj.searchParams.get('to');
    const key = urlObj.searchParams.get('key');
    const authHeader = req.headers.get('Authorization');
    const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

    if (!ADMIN_PASS || (key !== ADMIN_PASS && bearer !== ADMIN_PASS)) {
      return new Response(JSON.stringify({ error: 'Nicht autorisiert' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!to) {
      return new Response(JSON.stringify({ error: 'Parameter "to" fehlt' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const r = await sendMailSafe({
      to,
      subject: 'E-Mail Test',
      html: '<h1>E-Mail funktioniert!</h1><p>Diese Testmail wurde erfolgreich versendet.</p>',
    });

    return new Response(JSON.stringify(r), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Catch-all 404 for unhandled routes
  return new Response(JSON.stringify({ error: 'Route nicht gefunden' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
};

serve(handler);
