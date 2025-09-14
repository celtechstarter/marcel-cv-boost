import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text, voice = 'Liam' } = await req.json();

    if (!text) {
      throw new Error('Text ist erforderlich');
    }

    // Log for debugging (limit log size)
    console.log('TTS Request:', { 
      textLength: text.length, 
      voice, 
      textPreview: text.substring(0, 50) + (text.length > 50 ? '...' : '')
    });

    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API Key ist nicht konfiguriert');
    }

    // Use German-friendly voice IDs
    const voiceMap: Record<string, string> = {
      'Liam': 'TX3LPaxmHKxFdv7VOQHJ', // Warm, friendly male voice
      'Charlotte': 'XB0fDUnXU5powFXDhCwa', // Clear female voice
      'Daniel': 'onwK4e9ZLuTAKqWW03F9', // Professional male voice
      'Laura': 'FGY2WhTYpPnrIDTdsKH5', // Gentle female voice
    };

    const voiceId = voiceMap[voice] || voiceMap['Liam'];

    // Generate speech using ElevenLabs
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.2,
          use_speaker_boost: true
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Limit error log size to prevent stack overflow
      const truncatedError = errorText.length > 500 ? errorText.substring(0, 500) + '...' : errorText;
      console.error('ElevenLabs API Error:', truncatedError);
      
      if (response.status === 401) {
        throw new Error('ElevenLabs API Key ungültig oder abgelaufen');
      } else if (response.status === 429) {
        throw new Error('ElevenLabs Rate-Limit erreicht. Bitte versuchen Sie es später erneut.');
      } else {
        throw new Error(`Sprachgenerierung fehlgeschlagen: ${response.status}`);
      }
    }

    // Convert audio to base64
    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );

    console.log('TTS Success:', { audioSize: arrayBuffer.byteLength });

    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        contentType: 'audio/mpeg'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    // Limit error logging to prevent stack overflow
    const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
    console.error('TTS Error:', errorMessage.substring(0, 200));
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        fallbackMessage: 'Cloud-TTS nicht verfügbar. Browser-TTS wird verwendet.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});