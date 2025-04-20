
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const DAILY_API_KEY = Deno.env.get('DAILY_CO')
const DAILY_API_URL = 'https://api.daily.co/v1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateRoomResponse {
  id: string
  name: string
  url: string
  token?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Daily room function invoked')
    const { roomName, isOwner } = await req.json()

    if (!roomName) {
      console.log('Error: Room name is required')
      return new Response(
        JSON.stringify({ error: 'Room name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create room if it doesn't exist
    let roomData;
    console.log(`Attempting to create room: ${roomName}`)
    
    try {
      // First try to get the room, and if it doesn't exist, create it
      const getRoomResponse = await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${DAILY_API_KEY}`,
        },
      });
      
      if (getRoomResponse.status === 404) {
        // Room doesn't exist, create it
        console.log(`Room ${roomName} not found, creating it`)
        const roomResponse = await fetch(`${DAILY_API_URL}/rooms`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${DAILY_API_KEY}`,
          },
          body: JSON.stringify({
            name: roomName,
            privacy: 'private',
            properties: {
              exp: Math.round(Date.now() / 1000) + 3600, // Room expires in 1 hour
              eject_at_room_exp: true,
            },
          }),
        });
        
        roomData = await roomResponse.json();
        console.log('Room created:', roomData);
      } else {
        // Room exists, use it
        roomData = await getRoomResponse.json();
        console.log('Existing room found:', roomData);
      }
    } catch (error) {
      console.error('Error creating/getting room:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create or get room' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create meeting token
    console.log('Creating meeting token')
    let tokenData;
    try {
      const tokenResponse = await fetch(`${DAILY_API_URL}/meeting-tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${DAILY_API_KEY}`,
        },
        body: JSON.stringify({
          properties: {
            room_name: roomName,
            is_owner: isOwner,
            exp: Math.round(Date.now() / 1000) + 3600, // Token expires in 1 hour
          },
        }),
      });
      
      tokenData = await tokenResponse.json();
      console.log('Token created:', tokenData.token ? 'Success' : 'Failed');
    } catch (error) {
      console.error('Error creating token:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create meeting token' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Ensure all required fields are present
    if (!roomData.name || !roomData.url) {
      console.error('Invalid room data received:', roomData);
      return new Response(
        JSON.stringify({ error: 'Invalid response from Daily API' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response: CreateRoomResponse = {
      id: roomData.id || '',
      name: roomData.name,
      url: roomData.url,
      token: tokenData.token,
    };

    console.log('Sending complete response with:', 
                'id', response.id ? 'present' : 'missing',
                'name', response.name ? 'present' : 'missing', 
                'url', response.url ? 'present' : 'missing',
                'token', response.token ? 'present' : 'missing');

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Unhandled error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
