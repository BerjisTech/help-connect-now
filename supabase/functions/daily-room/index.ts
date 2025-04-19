
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
    const { roomName, isOwner } = await req.json()

    if (!roomName) {
      return new Response(
        JSON.stringify({ error: 'Room name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create room if it doesn't exist
    const roomResponse = await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
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
    })

    const roomData = await roomResponse.json()

    // Create meeting token
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
    })

    const tokenData = await tokenResponse.json()

    const response: CreateRoomResponse = {
      id: roomData.id,
      name: roomData.name,
      url: roomData.url,
      token: tokenData.token,
    }

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
