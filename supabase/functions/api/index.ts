import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Secure CORS for production
const allowedOrigins = [
  'https://marcel-cv-boost.lovable.dev',
  'https://deine-domain.de',
  'http://localhost:3000',
  'https://542cf94b-6c9e-4ab7-93f7-aaeacf7a41b9.sandbox.lovable.dev'
];

// Initialize clients
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const SITE_URL = 'https://marcel-cv-boost.lovable.dev';

// Spam protection function
function validateReviewContent(body: string): string | null {
  if (body.length < 10) {
    return 'Review body must be at least 10 characters long';
  }
  
  const linkCount = (body.match(/https?:\/\/[^\s]+/g) || []).length;
  if (linkCount > 2) {
    return 'Review body cannot contain more than 2 links';
  }
  
  return null;
}

// CORS validation
function validateCORS(origin: string | null): boolean {
  return origin ? allowedOrigins.includes(origin) : false;
}

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get('Origin');
  
  // CORS validation for production security
  if (origin && !validateCORS(origin)) {
    return new Response(JSON.stringify({ error: 'Origin not allowed' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
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

    // Route: POST /reviews/create
    if (path === '/reviews/create' && req.method === 'POST') {
      const { name, email, rating, title, body } = await req.json();

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

      // Send verification email
      try {
        const verificationUrl = `${SITE_URL}/review-verify?id=${reviewId}&code=${code}`;
        
        await resend.emails.send({
          from: 'Marcel <onboarding@resend.dev>',
          to: [email],
          subject: 'Please verify your review',
          html: `
            <h1>Verify Your Review</h1>
            <p>Thank you for your review, ${name}!</p>
            <p>Your verification code is: <strong>${code}</strong></p>
            <p><a href="${verificationUrl}">Click here to verify your review</a></p>
            <p>If you didn't submit this review, you can safely ignore this email.</p>
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

      // Apply free slot usage - this is critical for slot management
      try {
        const { error: slotError } = await supabase.rpc('apply_free_slot', { p_year: year, p_month: month });
        if (slotError) {
          console.error('Error applying slot usage:', slotError);
          return new Response(JSON.stringify({ error: 'Keine freien Slots mehr in diesem Monat.' }), {
            status: 409,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      } catch (slotError) {
        console.error('Critical slot error:', slotError);
        return new Response(JSON.stringify({ error: 'Keine freien Slots mehr in diesem Monat.' }), {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Send confirmation emails
      try {
        const startDate = new Date(startsAt);
        const formattedDate = startDate.toLocaleDateString('de-DE');
        const formattedTime = startDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

        // Email to user
        await resend.emails.send({
          from: 'Marcel <onboarding@resend.dev>',
          to: [email],
          subject: 'Booking Confirmation',
          html: `
            <h1>Booking Confirmed</h1>
            <p>Hello ${name},</p>
            <p>Your booking has been confirmed for:</p>
            <ul>
              <li><strong>Date:</strong> ${formattedDate}</li>
              <li><strong>Time:</strong> ${formattedTime}</li>
              <li><strong>Duration:</strong> ${duration} minutes</li>
              ${discordName ? `<li><strong>Discord:</strong> ${discordName}</li>` : ''}
              ${note ? `<li><strong>Note:</strong> ${note}</li>` : ''}
            </ul>
            <p>I'll contact you soon with more details!</p>
            <p>Best regards,<br>Marcel</p>
          `,
        });

        // Email to admin
        await resend.emails.send({
          from: 'Booking System <onboarding@resend.dev>',
          to: ['marcel.welk87@gmail.com'],
          subject: 'New Booking Received',
          html: `
            <h1>New Booking</h1>
            <p>New booking from ${name} (${email}):</p>
            <ul>
              <li><strong>Date:</strong> ${formattedDate}</li>
              <li><strong>Time:</strong> ${formattedTime}</li>
              <li><strong>Duration:</strong> ${duration} minutes</li>
              ${discordName ? `<li><strong>Discord:</strong> ${discordName}</li>` : ''}
              ${note ? `<li><strong>Note:</strong> ${note}</li>` : ''}
            </ul>
            <p>Booking ID: ${data}</p>
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