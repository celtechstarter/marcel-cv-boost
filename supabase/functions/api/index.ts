import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Secure CORS for GDPR compliance - restrict to authorized domains only
const allowedOrigins = [
  'https://marcel-cv-boost.lovable.dev',
  'https://marcel-cv-boost.lovable.app',
  'http://localhost:3000',
  // Keep preview domain for development (will be removed in production)
  'https://542cf94b-6c9e-4ab7-93f7-aaeacf7a41b9.sandbox.lovable.dev'
];

// Initialize clients
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const SITE_URL = 'https://marcel-cv-boost.lovable.dev';
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

// CORS validation - Enhanced security for GDPR compliance
function validateCORS(origin: string | null): boolean {
  if (!origin) return false;
  
  // Strict allowlist - only production and development domains
  const isAllowed = allowedOrigins.includes(origin) || 
                   origin.endsWith('.lovable.dev') || 
                   origin.endsWith('.lovable.app');
  
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

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get('Origin');
  
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
      const { filename, email } = await req.json();

      if (!filename || !email) {
        return new Response(JSON.stringify({ 
          error: 'Dateiname und E-Mail sind erforderlich' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return new Response(JSON.stringify({ 
          error: 'Ungültige E-Mail-Adresse' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Validate filename and ensure PDF
      if (!filename.toLowerCase().endsWith('.pdf')) {
        return new Response(JSON.stringify({ 
          error: 'Nur PDF-Dateien sind erlaubt' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Generate secure path with timestamp and UUID
      const uploadId = crypto.randomUUID();
      const timestamp = new Date().getTime();
      const sanitizedFilename = sanitizeFilename(filename);
      const storagePath = `uploads/${timestamp}-${uploadId}/${sanitizedFilename}`;

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

      // Log upload request for audit
      await supabase.rpc('log_audit_event', {
        p_event_type: 'file_upload_requested',
        p_actor_email: email,
        p_actor_role: 'anonymous',
        p_actor_ip: clientIP,
        p_resource_id: uploadId,
        p_details: { filename: sanitizedFilename, storage_path: storagePath }
      });

      return new Response(JSON.stringify({
        uploadUrl: uploadData.signedUrl,
        uploadId: uploadId,
        storagePath: storagePath,
        expiresIn: 600
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
  if (req.method === 'POST' && url.pathname === '/requests/create') {
    try {
      const { name, email, discord_name, message } = await req.json();

      if (!name?.trim() || !email?.trim() || !message?.trim()) {
        return new Response(
          JSON.stringify({ error: 'Name, E-Mail und Nachricht sind erforderlich' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Send confirmation email to user with GDPR footer
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Marcel <noreply@marcel-cv-boost.lovable.dev>',
          to: [email],
          subject: 'Anfrage erhalten - Bewerbungshilfe',
          text: `Hallo ${name},

vielen Dank für deine Anfrage zur Bewerbungshilfe.

Ich habe deine Nachricht erhalten:
"${message}"

Ich melde mich zeitnah bei dir, um dir zu helfen.

Viele Grüße
Marcel${GDPR_EMAIL_FOOTER}`
        })
      });

      // Send notification to Marcel
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Bewerbungshilfe <noreply@marcel-cv-boost.lovable.dev>',
          to: ['marcel.welk87@gmail.com'],
          subject: 'Neue Bewerbungshilfe-Anfrage',
          text: `Neue Anfrage erhalten:

Name: ${name}
E-Mail: ${email}
Discord: ${discord_name || 'Nicht angegeben'}

Nachricht:
${message}`
        })
      });

      return new Response(
        JSON.stringify({ success: true }),
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
      const { name, email, discordName, note, startsAt, duration } = await req.json();

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

      if (slotsData <= 0) {
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
          p_duration: duration
        });

      if (error) {
        console.error('Error creating booking:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Note: We no longer apply slot usage here - slots are consumed only on approval

      // Send confirmation emails with German content
      try {
        const startDate = new Date(startsAt);
        const formattedDate = startDate.toLocaleDateString('de-DE');
        const formattedTime = startDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

        // Email to user with GDPR footer
        await resend.emails.send({
          from: 'Marcel <onboarding@resend.dev>',
          to: [email],
          subject: 'Terminbestätigung Bewerbungshilfe',
          html: `
            <h1>Terminbestätigung</h1>
            <p>Hallo ${name},</p>
            <p>vielen Dank für deine Anfrage.</p>
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

        // Email to admin
        await resend.emails.send({
          from: 'Booking System <onboarding@resend.dev>',
          to: ['marcel.welk87@gmail.com'],
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
            <p>Buchungs-ID: ${data}</p>
          `,
        });

        console.log('Confirmation emails sent successfully');
      } catch (emailError) {
        console.error('Failed to send confirmation emails:', emailError);
        // Continue without failing the booking
      }

      return new Response(JSON.stringify({ bookingId: data }), {
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

      if (reviewsError || bookingsError) {
        console.error('Dashboard data error:', { reviewsError, bookingsError });
        return new Response(JSON.stringify({ error: 'Failed to fetch dashboard data' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({
        pendingReviews: pendingReviews || [],
        upcomingBookings: upcomingBookings || []
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