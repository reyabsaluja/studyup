
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, imageUrls } = await req.json();
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Prepare parts for Gemini API
    const parts: any[] = [{
      text: context 
        ? `Context:\n${context}\n\nUser Question: ${message}`
        : message
    }];

    if (imageUrls && Array.isArray(imageUrls)) {
      for (const url of imageUrls) {
        try {
          const imageResponse = await fetch(url);
          if (!imageResponse.ok) {
            console.warn(`Failed to fetch image from ${url}, status: ${imageResponse.status}`);
            continue;
          }
          const contentType = imageResponse.headers.get('content-type');
          if (!contentType || !contentType.startsWith('image/')) {
            console.warn(`URL ${url} did not return a valid image content-type, but ${contentType}`);
            continue;
          }

          const arrayBuffer = await imageResponse.arrayBuffer();
          const base64data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

          parts.push({
            inline_data: {
              mime_type: contentType,
              data: base64data
            }
          });
        } catch (e) {
          console.error(`Error fetching or processing image url ${url}:`, e);
        }
      }
    }

    // Prepare the request to Gemini API
    const requestBody = {
      contents: [{ parts }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate response from Gemini' }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
      console.error('Invalid response from Gemini, possible safety block:', JSON.stringify(data));
      const reason = data?.promptFeedback?.blockReason || 'unknown reason';
      return new Response(
        JSON.stringify({ error: `No response generated. This might be due to safety settings. Reason: ${reason}` }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-type': 'application/json' }
        }
      );
    }

    const generatedText = data.candidates[0].content.parts.map((part: any) => part.text || '').join('');

    return new Response(
      JSON.stringify({ 
        response: generatedText,
        model: 'gemini-1.5-flash-latest'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in chat-with-gemini function:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
