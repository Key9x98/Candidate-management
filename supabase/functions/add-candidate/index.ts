import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the JWT token from the Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Verify the JWT token and get the user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      throw new Error('Invalid token or user not found')
    }

    // Parse the request body
    const { full_name, applied_position, status, resume_url } = await req.json()

    // Validate required fields
    if (!full_name || !applied_position) {
      throw new Error('full_name and applied_position are required')
    }

    // Validate status
    const validStatuses = ['New', 'Interviewing', 'Hired', 'Rejected']
    if (status && !validStatuses.includes(status)) {
      throw new Error('Invalid status value')
    }

    // Insert the candidate
    const { data, error } = await supabaseClient
      .from('candidates')
      .insert({
        user_id: user.id,
        full_name: full_name.trim(),
        applied_position: applied_position.trim(),
        status: status || 'New',
        resume_url: resume_url || null
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        data: data,
        message: 'Candidate added successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      }
    )

  } catch (error) {
    console.error('Error in add-candidate function:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})