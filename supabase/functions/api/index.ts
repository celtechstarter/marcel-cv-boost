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

// Spam protection function
function validateReviewContent(body: string): string | null {
  if (body.length < 10) {
    return 'Bitte schreibe eine aussagekräftige Bewertung ohne zu viele Links.';
  }
  
  const linkCount = (body.match(/https?:\/\/[^\s]+/g) || []).length;
  if (linkCount > 2) {
    return 'Bitte schreibe eine aussagekräftige Bewertung ohne zu viele Links.';
  }
  
  return null;
}

// Enhanced CORS validation - secure allowlist with dynamic preview support
function validateCORS(origin: string | null): boolean {
  if (!origin) return false;
  
  // Strict allowlist for production and development domains
  const isAllowed = allowedOrigins.includes(origin) || isLovablePreview(origin);
  
  return isAllowed;
}

// Helper function to get client IP for audit logging
function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
         req.headers.get('x-real-ip') ||
         'unknown';
}

// Helper function to normalize filename for security
function sanitizeFilename(filename: string): string {
  // Remove path traversal attempts and dangerous characters
  return filename
    .replace(/[^a-zA-Z0-9.\-_]/g, '_')
    .replace(/\.+/g, '.')
    .slice(0, 100); // Limit length
}

// Validate PDF file by checking magic bytes
function isPDFFile(buffer: ArrayBuffer): boolean {
  const header = new Uint8Array(buffer.slice(0, 5));
  // PDF files start with %PDF-
  return header[0] === 0x25 && 
         header[1] === 0x50 && 
         header[2] === 0x44 && 
         header[3] === 0x46 && 
         header[4] === 0x2D;
}

// GDPR-compliant email footer
const GDPR_EMAIL_FOOTER = `

---
Hinweis: Verarbeitung gemäß Datenschutzerklärung. Auftragsverarbeiter: Supabase (EU-Region) und Resend (E-Mail).`;

// Mail helper: send via Resend safely without throwing
async function sendMailSafe({ to, subject, text, html }: { to: string | string[]; subject: string; text?: string; html?: string; }) {
  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      return { ok: false as const, reason: 'no_key' as const };
    }

    const res = await resend.emails.send({
      from: 'Marcel <onboarding@resend.dev>', // TODO: switch to verified domain when available
      to: Array.isArray(to) ? to : [to],
      subject,
      ...(text ? { text } : {}),
      ...(html ? { html } : {}),
    });

    if ((res as any)?.error) {
      return { ok: false as const, reason: 'resend_error' as const, body: (res as any).error };
    }

    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, reason: 'unknown_error' as const, message: (err as Error).message };
  }
}

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get('Origin');
  const corsHeaders = getCorsHeaders(origin);
  
  // Enhanced CORS validation for GDPR compliance
  if (origin && !validateCORS(origin)) {
    console.log(`Blocked origin: ${origin}`);
    return new Response(JSON.stringify({ 
      error: 'Origin not allowed',
      details: 'Diese Domain ist nicht für den Zugriff autorisiert.' 
    }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const clientIP = getClientIP(req);
  const url = new URL(req.url);
  const rawPath = url.pathname;
  const path = rawPath.replace(/^\/functions\/v1/, '').replace(/^\/api/, '');
  
  console.log(`API request: ${req.method} ${rawPath} -> ${path} from ${clientIP}`);

  // **NEW: POST /uploads/create-signed** - Create secure signed upload URL for PDFs
  if (path === '/uploads/create-signed' && req.method === 'POST') {
    try {
      const { filename, size_bytes, content_type } = await req.json();

      if (!filename || !size_bytes || !content_type) {
        return new Response(JSON.stringify({ 
          error: 'Dateiname, Dateigröße und Dateityp sind erforderlich' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Validate content type must be PDF
      if (content_type !== 'application/pdf') {
        return new Response(JSON.stringify({ 
          error: 'Nur PDF-Dateien sind erlaubt' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Validate file size (10MB max)
      if (size_bytes > 10485760) {
        return new Response(JSON.stringify({ 
          error: 'Datei zu groß (maximal 10 MB)' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Normalize filename to safe ASCII basename
      const sanitizedFilename = sanitizeFilename(filename);
      const uploadId = crypto.randomUUID();
      const storagePath = `requests/${uploadId}/${sanitizedFilename}`;

      // Create signed upload URL (10 minutes TTL)
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cv_uploads')
        .createSignedUploadUrl(storagePath, {
          expiresIn: 600, // 10 minutes
          upsert: false
        });

      if (uploadError) {
        console.error('Error creating signed upload URL:', uploadError);
        return new Response(JSON.stringify({ 
          error: 'Fehler beim Erstellen der Upload-URL' 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({
        path: storagePath,
        upload_url: uploadData.signedUrl
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error('Error in upload URL creation:', error);
      return new Response(JSON.stringify({ 
        error: 'Interner Serverfehler' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  // **NEW: POST /uploads/confirm** - Confirm successful upload and store metadata
  if (path === '/uploads/confirm' && req.method === 'POST') {
    try {
      const { uploadId, storagePath, email, originalFilename, fileSize } = await req.json();

      if (!uploadId || !storagePath || !email || !originalFilename || !fileSize) {
        return new Response(JSON.stringify({ 
          error: 'Fehlende Upload-Informationen' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Validate file size (10MB max)
      if (fileSize > 10485760) {
        return new Response(JSON.stringify({ 
          error: 'Datei zu groß (maximal 10 MB)' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get file info from storage to validate upload
      const { data: fileInfo, error: fileError } = await supabase.storage
        .from('cv_uploads')
        .info(storagePath);

      if (fileError || !fileInfo) {
        return new Response(JSON.stringify({ 
          error: 'Upload-Bestätigung fehlgeschlagen' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Store upload metadata for GDPR compliance
      const { error: dbError } = await supabase
        .from('uploads')
        .insert({
          id: uploadId,
          user_email: email,
          original_filename: originalFilename,
          storage_path: storagePath,
          size_bytes: fileSize,
          sha256_hash: fileInfo.checksum || 'unknown',
          created_by_ip: clientIP
        });

      if (dbError) {
        console.error('Error storing upload metadata:', dbError);
        return new Response(JSON.stringify({ 
          error: 'Fehler beim Speichern der Upload-Informationen' 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Log successful upload for audit
      await supabase.rpc('log_audit_event', {
        p_event_type: 'file_upload_completed',
        p_actor_email: email,
        p_actor_role: 'anonymous',
        p_actor_ip: clientIP,
        p_resource_id: uploadId,
        p_details: { 
          filename: originalFilename,
          size_bytes: fileSize,
          storage_path: storagePath
        }
      });

      return new Response(JSON.stringify({ 
        success: true,
        uploadId: uploadId 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error('Error confirming upload:', error);
      return new Response(JSON.stringify({ 
        error: 'Interner Serverfehler' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  // POST /requests/create - Handle general request submissions
  if (path === '/requests/create' && req.method === 'POST') {
    try {
      const { name, email, discord_name, message, cv_path } = await req.json();

      if (!name?.trim() || !email?.trim() || !message?.trim()) {
        return new Response(
          JSON.stringify({ error: 'Name, E-Mail und Nachricht sind erforderlich' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Send confirmation email to user using sendMailSafe
      const userMail = await sendMailSafe({
        to: email,
        subject: 'Anfrage erhalten - Bewerbungshilfe',
        html: `
          <h1>Anfrage erhalten</h1>
          <p>Hallo ${name},</p>
          <p>vielen Dank für deine Anfrage zur Bewerbungshilfe.</p>
          <p>Ich habe deine Nachricht erhalten:</p>
          <blockquote style="border-left: 3px solid #0066cc; padding-left: 16px; margin: 16px 0; font-style: italic;">"${message}"</blockquote>
          <p>Ich melde mich zeitnah bei dir, um dir zu helfen.</p>
          <p>Viele Grüße<br>Marcel</p>
          <hr>
          <small>Hinweis: Verarbeitung gemäß Datenschutzerklärung. Auftragsverarbeiter: Supabase (EU-Region) und Resend (E-Mail).</small>
        `,
      });

      // Send notification to Marcel using sendMailSafe
      const adminMail = await sendMailSafe({
        to: 'marcel.welk@bewerbungsmensch.de',
        subject: 'Neue Bewerbungshilfe-Anfrage',
        html: `
          <h1>Neue Bewerbungshilfe-Anfrage</h1>
          <p>Neue Anfrage von ${name} (${email}):</p>
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

      // Enhanced logging for email diagnostics
      console.log(`[REQUEST-EMAIL-DEBUG] User mail result:`, JSON.stringify(userMail));
      console.log(`[REQUEST-EMAIL-DEBUG] Admin mail result:`, JSON.stringify(adminMail));

      const mailStatus = (userMail.ok && adminMail.ok) ? 'sent' : 'not_sent';

      if (mailStatus === 'not_sent') {
        console.error(`[REQUEST-EMAIL-ERROR] Email failed - User: ${JSON.stringify(userMail)}, Admin: ${JSON.stringify(adminMail)}`);
        
        // Best-effort logging to form_errors (if table exists)
        try {
          await supabase.from('form_errors').insert({
            endpoint: 'requests/create',
            status: 'mail_failed',
            message: JSON.stringify({ user: userMail, admin: adminMail }).slice(0, 1000),
          });
        } catch (logErr) {
          console.warn('form_errors log failed (ignored):', (logErr as Error).message);
        }
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

  try {
    const url = new URL(req.url);
    const rawPath = url.pathname;
    const path = rawPath.replace(/^\/functions\/v1/, '').replace(/^\/api/, '');
    
    console.log(`API request: ${req.method} ${rawPath} -> ${path}`);

    // Route: GET /slots/remaining
    if (path === '/slots/remaining' && req.method === 'GET') {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      const { data, error } = await supabase
        .rpc('slots_remaining_safe', { p_year: year, p_month: month });

      if (error) {
        console.error('Error fetching slots:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ remaining: data || 0 }), {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
        },
      });
    }

    // Route: GET /slots/state
    if (path === '/slots/state' && req.method === 'GET') {
      const urlObj = new URL(req.url);
      const now = new Date();
      const year = parseInt(urlObj.searchParams.get('year') || now.getFullYear().toString());
      const month = parseInt(urlObj.searchParams.get('month') || (now.getMonth() + 1).toString());

      const { data, error } = await supabase.rpc('public_get_slot_state', {
        p_year: year,
        p_month: month
      });

      if (error) {
        console.error('Error fetching slot state:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const result = Array.isArray(data) ? data[0] : data;
      return new Response(JSON.stringify(result || { year, month, max_slots: 5, used_slots: 0, remaining: 5 }), {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
        },
      });
    }

    // Route: POST /reviews/create
    if (path === '/reviews/create' && req.method === 'POST') {
      const { name, email, rating, title, body, hcaptchaToken } = await req.json();

      // Check hCaptcha token (stub validation for now)
      if (!hcaptchaToken) {
        return new Response(JSON.stringify({ error: 'Captcha-Verifizierung erforderlich' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Spam protection
      const validationError = validateReviewContent(body);
      if (validationError) {
        return new Response(JSON.stringify({ error: validationError }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data, error } = await supabase
        .rpc('public_create_review', {
          p_name: name,
          p_email: email,
          p_rating: rating,
          p_title: title || '',
          p_body: body
        });

      if (error) {
        console.error('Error creating review:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const reviewId = data[0].review_id;
      const code = data[0].code;

      // Send verification email with German content
      try {
        const verificationUrl = `${SITE_URL}/review-verify?id=${reviewId}&code=${code}`;
        
        await resend.emails.send({
          from: 'Marcel <onboarding@resend.dev>',
          to: [email],
          subject: 'Bitte bestätige deine Bewertung',
          html: `
            <h1>Bewertung bestätigen</h1>
            <p>Hallo,</p>
            <p>vielen Dank für deine Bewertung.</p>
            <p>Bitte bestätige sie mit folgendem Code: <strong>${code}</strong></p>
            <p>Oder klicke direkt auf diesen Link:</p>
            <p><a href="${verificationUrl}" style="color: #0066cc; text-decoration: none;">${verificationUrl}</a></p>
            <p>Viele Grüße<br>Marcel</p>
            <hr>
            <small>Hinweis: Verarbeitung gemäß Datenschutzerklärung. Auftragsverarbeiter: Supabase (EU-Region) und Resend (E-Mail).</small>
          `,
        });
        console.log('Verification email sent successfully');
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Continue without failing the review creation
      }

      return new Response(JSON.stringify({
        review_id: reviewId,
        code: code
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Route: POST /reviews/verify
    if (path === '/reviews/verify' && req.method === 'POST') {
      const { reviewId, code } = await req.json();

      const { data, error } = await supabase
        .rpc('public_verify_review', {
          p_review_id: reviewId,
          p_code: code
        });

      if (error) {
        console.error('Error verifying review:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (!data) {
        return new Response(JSON.stringify({ error: 'Ungültiger Verifizierungscode oder Bewertung bereits verifiziert' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Route: POST /reviews/publish
    if (path === '/reviews/publish' && req.method === 'POST') {
      const { reviewId, adminPassword } = await req.json();

      // Check admin password
      const expectedPassword = Deno.env.get('ADMIN_PASS');
      if (adminPassword !== expectedPassword) {
        return new Response(JSON.stringify({ error: 'Ungültiges Admin-Passwort' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { error } = await supabase
        .rpc('admin_publish_review', { p_review_id: reviewId });

      if (error) {
        console.error('Error publishing review:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Route: POST /bookings/create
    if (path === '/bookings/create' && req.method === 'POST') {
      const body = await req.json();
      const name = body.name;
      const email = body.email;
      const discordName = body.discordName ?? body.discord_name ?? '';
      const note = body.note ?? '';
      const startsAt = body.startsAt ?? body.starts_at;
      const duration = body.duration ?? body.duration_minutes;

      if (!name?.trim() || !email?.trim() || !startsAt || !duration) {
        return new Response(JSON.stringify({ error: 'Name, E-Mail, Startzeit und Dauer sind erforderlich.' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check available slots first using the safe function
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      const { data: slotsData, error: slotsError } = await supabase
        .rpc('slots_remaining_safe', { p_year: year, p_month: month });

      if (slotsError) {
        console.error('Error checking slots:', slotsError);
        return new Response(JSON.stringify({ error: 'Fehler beim Prüfen der verfügbaren Slots' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if ((slotsData as number) <= 0) {
        return new Response(JSON.stringify({ error: 'Keine freien Slots mehr in diesem Monat.' }), {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Create booking
      const { data, error } = await supabase
        .rpc('public_create_booking', {
          p_name: name,
          p_email: email,
          p_discord_name: discordName || '',
          p_note: note || '',
          p_starts_at: startsAt,
          p_duration: duration,
        });

      if (error) {
        console.error('Error creating booking:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const bookingId = Array.isArray(data) ? data[0] : data;

      // Send confirmation emails (do not throw on failure)
      const startDate = new Date(startsAt);
      const formattedDate = startDate.toLocaleDateString('de-DE');
      const formattedTime = startDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

      const userMail = await sendMailSafe({
        to: email,
        subject: 'Terminbestätigung Bewerbungshilfe',
        html: `
          <h1>Terminbestätigung</h1>
          <p>Hallo ${name},</p>
          <p>vielen Dank für deine Buchung.</p>
          <p>Dein Termin wurde angelegt:</p>
          <ul>
            <li><strong>Datum/Uhrzeit:</strong> ${formattedDate} um ${formattedTime}</li>
            <li><strong>Dauer:</strong> ${duration} Minuten</li>
            <li><strong>Hinweis:</strong> Wir sprechen über Discord.</li>
          </ul>
          ${discordName ? `<p>Dein Discord-Name: ${discordName}</p>` : ''}
          ${note ? `<p>Deine Notiz: ${note}</p>` : ''}
          <p>Viele Grüße<br>Marcel</p>
          <hr>
          <small>Hinweis: Verarbeitung gemäß Datenschutzerklärung. Auftragsverarbeiter: Supabase (EU-Region) und Resend (E-Mail).</small>
        `,
      });

      const adminMail = await sendMailSafe({
        to: 'marcel.welk@bewerbungsmensch.de',
        subject: 'Neue Terminbuchung',
        html: `
          <h1>Neue Terminbuchung</h1>
          <p>Neue Buchung von ${name} (${email}):</p>
          <ul>
            <li><strong>Datum/Uhrzeit:</strong> ${formattedDate} um ${formattedTime}</li>
            <li><strong>Dauer:</strong> ${duration} Minuten</li>
            ${discordName ? `<li><strong>Discord:</strong> ${discordName}</li>` : ''}
            ${note ? `<li><strong>Notiz:</strong> ${note}</li>` : ''}
          </ul>
          <p>Buchungs-ID: ${bookingId}</p>
        `,
      });

      // Enhanced logging for email diagnostics
      console.log(`[BOOKING-EMAIL-DEBUG] User mail result:`, JSON.stringify(userMail));
      console.log(`[BOOKING-EMAIL-DEBUG] Admin mail result:`, JSON.stringify(adminMail));

      const mailStatus = (userMail.ok && adminMail.ok) ? 'sent' : 'not_sent';

      if (mailStatus === 'not_sent') {
        console.error(`[BOOKING-EMAIL-ERROR] Email failed - User: ${JSON.stringify(userMail)}, Admin: ${JSON.stringify(adminMail)}`);
        
        // Best-effort logging to form_errors (if table exists)
        try {
          await supabase.from('form_errors').insert({
            endpoint: 'bookings/create',
            status: 'mail_failed',
            message: JSON.stringify({ user: userMail, admin: adminMail }).slice(0, 1000),
          });
        } catch (logErr) {
          console.warn('form_errors log failed (ignored):', (logErr as Error).message);
        }
      } else {
        console.log(`[BOOKING-EMAIL-SUCCESS] Both emails sent successfully for booking ${bookingId}`);
      }

      return new Response(JSON.stringify({ 
        ok: true, 
        bookingId: bookingId, 
        emailSent: mailStatus === 'sent'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Route: GET /diagnostics/email?to=<address>&key=<ADMIN_PASS>
    if (path === '/diagnostics/email' && req.method === 'GET') {
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
        subject: 'E-Mail-Diagnose (Testversand)',
        text: 'Dies ist ein Testversand aus der E-Mail-Diagnose. ' + GDPR_EMAIL_FOOTER,
      });

      if (!r.ok) {
        return new Response(JSON.stringify({ ok: false, reason: r.reason || 'unknown' }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Route: POST /admin/reset-slots
    if (path === '/admin/reset-slots' && req.method === 'POST') {
      const { adminPass } = await req.json();

      // Check admin password
      const expectedPassword = Deno.env.get('ADMIN_PASS');
      if (adminPass !== expectedPassword) {
        return new Response(JSON.stringify({ error: 'Nicht autorisiert' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { error } = await supabase.rpc('reset_month_slots');

      if (error) {
        console.error('Error resetting slots:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Route: POST /admin/uploads/delete - Admin delete uploaded file
    if (path === '/admin/uploads/delete' && req.method === 'POST') {
      const authHeader = req.headers.get('Authorization');
      const adminPassword = authHeader?.replace('Bearer ', '');

      // Check admin password
      const expectedPassword = Deno.env.get('ADMIN_PASS');
      if (adminPassword !== expectedPassword) {
        return new Response(JSON.stringify({ error: 'Nicht autorisiert' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      try {
        const { path: filePath } = await req.json();

        if (!filePath) {
          return new Response(JSON.stringify({ error: 'Dateipfad ist erforderlich' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('cv_uploads')
          .remove([filePath]);

        if (storageError) {
          console.error('Error deleting file from storage:', storageError);
          return new Response(JSON.stringify({ error: 'Fehler beim Löschen der Datei' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Delete metadata record if exists
        await supabase
          .from('uploads')
          .delete()
          .eq('path', filePath);

        return new Response(JSON.stringify({ ok: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      } catch (error) {
        console.error('Error in admin file delete:', error);
        return new Response(JSON.stringify({ error: 'Interner Serverfehler' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Route: GET /admin/dashboard
    if (path === '/admin/dashboard' && req.method === 'GET') {
      const authHeader = req.headers.get('Authorization');
      const adminPassword = authHeader?.replace('Bearer ', '');

      // Check admin password
      const expectedPassword = Deno.env.get('ADMIN_PASS');
      if (adminPassword !== expectedPassword) {
        return new Response(JSON.stringify({ error: 'Ungültiges Admin-Passwort' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get pending reviews
      const { data: pendingReviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('id, name, title, rating, body, verified_at')
        .eq('status', 'verifiziert')
        .order('verified_at', { ascending: false });

      // Get upcoming bookings (next 7 days)
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      const { data: upcomingBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .gte('starts_at', new Date().toISOString())
        .lte('starts_at', nextWeek.toISOString())
        .order('starts_at', { ascending: true });

      // Get help requests with CVs (last 30 days)
      const { data: helpRequests, error: helpError } = await supabase.rpc('admin_list_help_requests', {
        p_limit: 50,
        p_offset: 0
      });

      if (reviewsError || bookingsError || helpError) {
        console.error('Dashboard data error:', { reviewsError, bookingsError, helpError });
        return new Response(JSON.stringify({ error: 'Failed to fetch dashboard data' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({
        pendingReviews: pendingReviews || [],
        upcomingBookings: upcomingBookings || [],
        helpRequests: helpRequests || []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Route: POST /admin/bookings/approve
    if (path === '/admin/bookings/approve' && req.method === 'POST') {
      const authHeader = req.headers.get('Authorization');
      const adminPassword = authHeader?.replace('Bearer ', '');

      const expectedPassword = Deno.env.get('ADMIN_PASS');
      if (adminPassword !== expectedPassword) {
        return new Response(JSON.stringify({ error: 'Ungültiges Admin-Passwort' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      try {
        const body = await req.json();
        const { booking_id } = body;

        if (!booking_id) {
          return new Response(JSON.stringify({ error: 'booking_id is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data, error } = await supabase.rpc('admin_approve_booking', {
          p_booking_id: booking_id
        });

        if (error) {
          console.error('Error approving booking:', error);
          if (error.message.includes('Keine freien Slots')) {
            return new Response(JSON.stringify({ error: 'Keine freien Slots mehr in diesem Monat.' }), {
              status: 409,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
          throw new Error('Failed to approve booking');
        }

        return new Response(JSON.stringify({ ok: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Error in booking approval:', error);
        return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Route: POST /admin/bookings/reject
    if (path === '/admin/bookings/reject' && req.method === 'POST') {
      const authHeader = req.headers.get('Authorization');
      const adminPassword = authHeader?.replace('Bearer ', '');

      const expectedPassword = Deno.env.get('ADMIN_PASS');
      if (adminPassword !== expectedPassword) {
        return new Response(JSON.stringify({ error: 'Ungültiges Admin-Passwort' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      try {
        const body = await req.json();
        const { booking_id } = body;

        if (!booking_id) {
          return new Response(JSON.stringify({ error: 'booking_id is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data, error } = await supabase.rpc('admin_reject_booking', {
          p_booking_id: booking_id
        });

        if (error) {
          console.error('Error rejecting booking:', error);
          throw new Error('Failed to reject booking');
        }

        return new Response(JSON.stringify({ ok: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Error in booking rejection:', error);
        return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Route: POST /admin/cv-download
    if (path === '/admin/cv-download' && req.method === 'POST') {
      const authHeader = req.headers.get('Authorization');
      const adminPassword = authHeader?.replace('Bearer ', '');

      const expectedPassword = Deno.env.get('ADMIN_PASS');
      if (adminPassword !== expectedPassword) {
        return new Response(JSON.stringify({ error: 'Ungültiges Admin-Passwort' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      try {
        const body = await req.json();
        const { cvPath } = body;

        if (!cvPath) {
          return new Response(JSON.stringify({ error: 'CV path is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Generate signed URL for CV download
        const { data, error } = await supabase.rpc('admin_cv_signed_url', {
          p_path: cvPath,
          p_expires_sec: 300 // 5 minutes
        });

        if (error || !data) {
          console.error('Error generating signed URL:', error);
          return new Response(JSON.stringify({ error: 'CV nicht gefunden oder nicht verfügbar' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ downloadUrl: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Error in CV download:', error);
        return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // 404 for unknown routes
    return new Response(JSON.stringify({ error: 'Endpoint nicht gefunden' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);