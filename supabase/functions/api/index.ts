import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace('/functions/v1/api', '');
    
    console.log(`API request: ${req.method} ${path}`);

    // Route: GET /slots/remaining
    if (path === '/slots/remaining' && req.method === 'GET') {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      const { data, error } = await supabase
        .rpc('slots_remaining', { p_year: year, p_month: month });

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

      return new Response(JSON.stringify({
        review_id: data[0].review_id,
        code: data[0].code
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

      return new Response(JSON.stringify({ bookingId: data }), {
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