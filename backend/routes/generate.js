const express = require('express');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Helper: call Groq API
async function callGroq(messages, maxTokens = 4000) {
  const groqApiKey = process.env.GROQ_API_KEY;
  const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  // Parse JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  return JSON.parse(content);
}

// POST /api/generate/trip-plan - Generate AI trip plan using Groq
router.post('/trip-plan', optionalAuth, async (req, res) => {
  try {
    const { budget, numberOfPeople, destinationPreference, surpriseMe } = req.body;
    console.log('Received request:', { budget, numberOfPeople, destinationPreference, surpriseMe });

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey || groqApiKey === 'YOUR_GROQ_API_KEY_HERE') {
      return res.status(500).json({
        error: 'GROQ_API_KEY is not configured. Please add your Groq API key to server/.env'
      });
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
      "name": "Place/Activity Name",
      "category": "Nature / Park, Historical, Temple, Adventure, Museum, Market, Beach, etc.",
      "description": "1-2 line summary explaining why the place is worth visiting",
      "rating": 4.5,
      "reviewCount": 12340,
      "distanceFromHotel": "3.2 km",
      "distanceFromPrevious": "First stop / 2.5 km from previous stop",
      "travelTimeFromPrevious": "12 min drive",
      "travelTime": {
        "drive": "12 min",
        "walk": "25 min"
      },
      "openingHours": "6:00 AM – 7:00 PM",
      "visitDuration": "1.5 – 2 hours",
      "entryFee": "₹30 per person",
      "address": "Full address with landmarks",
      "scheduledTime": "Day 1 – 4:30 PM",
      "image_query": "short search term for the place, e.g. Lalbagh Botanical Garden Bangalore",
      "nearbyAlternatives": [
        "Alternative Place 1",
        "Alternative Place 2",
        "Alternative Place 3"
      ]
    }
  ],
  "localSecret": "A unique local tip or hidden gem about this destination"
}

IMPORTANT rules for the "activities" array:
- Provide 4-6 activities spread across the 2 days
- Each activity MUST include ALL fields shown above
- Use realistic ratings between 3.5 and 5.0
- Use realistic review counts (hundreds to tens of thousands)
- Distance should be realistic from the hotel area
- scheduledTime should follow a logical itinerary order (Day 1 morning → afternoon → evening, Day 2 morning → afternoon)
- entryFee should be "Free" if no entry fee is required
- nearbyAlternatives should contain exactly 3 real nearby places
- image_query should be a short, specific search term that would return an image of that exact place
- distanceFromPrevious: For the FIRST activity set "First stop", for subsequent activities set the distance/time from the previous activity (e.g., "2.5 km from previous stop")
- travelTimeFromPrevious: For the FIRST activity use the drive time from hotel, for subsequent use the drive time from the previous activity (e.g., "12 min drive")

Make sure to:
1. Provide REAL places with REAL addresses in the specified destination
2. Keep the total estimated cost within the budget of ₹${budget}
3. Suggest authentic local food experiences
4. Include both popular and offbeat activities
5. Make it practical for a weekend (2 days, 1 night)
6. Assign realistic and varied ratings and review counts to each activity
7. Order activities logically so each one is close to the previous one`;

    console.log('Calling Groq API...');

    const tripPlan = await callGroq([
      {
        role: 'system',
        content: 'You are a knowledgeable travel planner for India. Provide detailed, practical, and realistic trip plans with real place names, addresses, ratings, and visitor information. Always respond with valid JSON only, no additional text. Make sure every activity object has ALL required fields including category, rating, reviewCount, distanceFromHotel, distanceFromPrevious, travelTimeFromPrevious, travelTime, openingHours, visitDuration, entryFee, scheduledTime, image_query, and nearbyAlternatives.'
      },
      {
        role: 'user',
        content: prompt
      }
    ]);

    console.log('Returning trip plan:', tripPlan);
    res.json(tripPlan);

  } catch (error) {
    console.error('Error in generate-trip-plan:', error);
    res.status(500).json({
      error: error.message || 'Unknown error occurred'
    });
  }
});

// POST /api/generate/replace-activity - Generate a replacement activity
router.post('/replace-activity', optionalAuth, async (req, res) => {
  try {
    const { destination, currentActivity, existingActivities, hotelAddress } = req.body;
    console.log('Replace activity request:', { destination, currentActivity });

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey || groqApiKey === 'YOUR_GROQ_API_KEY_HERE') {
      return res.status(500).json({
        error: 'GROQ_API_KEY is not configured.'
      });
    }

    const existingNames = existingActivities?.map(a => a.name).join(', ') || '';

    const prompt = `I'm visiting ${destination} and want an ALTERNATIVE activity to replace "${currentActivity}".

The following activities are already in my itinerary, so DO NOT suggest any of these: ${existingNames}

Provide exactly ONE new activity in this JSON format:
{
  "name": "Place/Activity Name",
  "category": "Nature / Park, Historical, Temple, Adventure, Museum, Market, Beach, etc.",
  "description": "1-2 line summary explaining why the place is worth visiting",
  "rating": 4.5,
  "reviewCount": 12340,
  "distanceFromHotel": "3.2 km",
  "distanceFromPrevious": "2.5 km from previous stop",
  "travelTimeFromPrevious": "12 min drive",
  "travelTime": {
    "drive": "12 min",
    "walk": "25 min"
  },
  "openingHours": "6:00 AM – 7:00 PM",
  "visitDuration": "1.5 – 2 hours",
  "entryFee": "₹30 per person",
  "address": "Full address with landmarks in ${destination}",
  "scheduledTime": "Day 1 – 4:30 PM",
  "image_query": "short search term for the place",
  "nearbyAlternatives": [
    "Alternative Place 1",
    "Alternative Place 2",
    "Alternative Place 3"
  ]
}

Provide a REAL place with a REAL address in ${destination}. Include ALL fields. Return valid JSON only.`;

    const result = await callGroq([
      {
        role: 'system',
        content: 'You are a knowledgeable travel planner for India. Suggest real places with real addresses. Always respond with valid JSON only, no additional text.'
      },
      {
        role: 'user',
        content: prompt
      }
    ], 1500);

    console.log('Replacement activity:', result);
    res.json(result);

  } catch (error) {
    console.error('Error in replace-activity:', error);
    res.status(500).json({
      error: error.message || 'Unknown error occurred'
    });
  }
});

module.exports = router;
