import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { budget, numberOfPeople, destinationPreference, surpriseMe } = await req.json();
    console.log('Received request:', { budget, numberOfPeople, destinationPreference, surpriseMe });

    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY is not configured');
    }

    // Build the prompt for Groq
    const prompt = `Generate a detailed weekend trip plan for ${numberOfPeople} ${numberOfPeople === '1' ? 'person' : 'people'} with a budget of ₹${budget}.
${surpriseMe ? 'Surprise me with an interesting destination in India!' : `Destination preference: ${destinationPreference || 'any interesting place in India'}`}

Please provide a comprehensive trip plan in the following JSON format:
{
  "destination": "City Name",
  "summary": "Brief appealing description of the destination",
  "accommodations": [
    {
      "name": "Hotel/Hostel Name",
      "type": "Hotel/Hostel/Guesthouse",
      "cost": "₹X per night",
      "address": "Full address with area and city"
    }
  ],
  "meals": {
    "day1": {
      "breakfast": {"name": "Restaurant Name", "food": "Dish suggestions", "address": "Full address"},
      "lunch": {"name": "Restaurant Name", "food": "Dish suggestions", "address": "Full address"},
      "dinner": {"name": "Restaurant Name", "food": "Dish suggestions", "address": "Full address"}
    },
    "day2": {
      "breakfast": {"name": "Restaurant Name", "food": "Dish suggestions", "address": "Full address"},
      "lunch": {"name": "Restaurant Name", "food": "Dish suggestions", "address": "Full address"},
      "dinner": {"name": "Restaurant Name", "food": "Dish suggestions", "address": "Full address"}
    }
  },
  "activities": [
    {
      "name": "Activity/Place Name",
      "description": "Brief description",
      "duration": "X hours",
      "time": "Best time to visit",
      "address": "Full address with landmarks"
    }
  ],
  "localSecret": "A unique local tip or hidden gem about this destination"
}

Make sure to:
1. Provide REAL places with REAL addresses in the specified destination
2. Keep the total estimated cost within the budget of ₹${budget}
3. Suggest authentic local food experiences
4. Include both popular and offbeat activities
5. Make it practical for a weekend (2 days, 1 night)`;

    console.log('Calling Groq API...');
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a knowledgeable travel planner for India. Provide detailed, practical, and realistic trip plans with real place names and addresses. Always respond with valid JSON only, no additional text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Groq API response received');
    
    const content = data.choices[0].message.content;
    console.log('Generated content:', content);
    
    // Parse the JSON response from Groq
    let tripPlan;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        tripPlan = JSON.parse(jsonMatch[0]);
      } else {
        tripPlan = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Failed to parse trip plan from AI response');
    }

    console.log('Returning trip plan:', tripPlan);
    return new Response(JSON.stringify(tripPlan), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-trip-plan function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
