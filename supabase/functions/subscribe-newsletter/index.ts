import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get mail configuration from database
    const { data: mailConfig, error: configError } = await supabaseClient
      .from('site_config')
      .select('value')
      .eq('key', 'mail')
      .single()

    if (configError || !mailConfig) {
      throw new Error('Mail configuration not found')
    }

    const config = mailConfig.value
    const resendApiKey = config.resendApiKey

    if (!resendApiKey) {
      throw new Error('Resend API key not configured')
    }

    // Parse request body
    const { email } = await req.json()

    // Validate email
    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Valid email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if email already subscribed
    const { data: existing } = await supabaseClient
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return new Response(
        JSON.stringify({ success: true, message: 'Already subscribed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Add to newsletter subscribers table
    const { error: insertError } = await supabaseClient
      .from('newsletter_subscribers')
      .insert({
        email,
        source: 'experience_page',
        status: 'active'
      })

    if (insertError) {
      console.error('Failed to save subscriber:', insertError)
    }

    // Send welcome email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: `${config.fromName} <${config.fromEmail}>`,
        to: [email],
        subject: 'Welcome to The King & Carter Experience',
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #F5F5DC; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #C9A961; font-size: 32px; font-weight: 300; margin: 0;">
                The King & Carter Experience
              </h1>
              <div style="width: 60px; height: 1px; background: #C9A961; margin: 20px auto;"></div>
            </div>
            
            <div style="line-height: 1.8; font-size: 16px; color: #F5F5DC;">
              <p style="margin-bottom: 20px;">Thank you for your interest in The King & Carter Experience.</p>
              
              <p style="margin-bottom: 20px;">
                We are crafting something exceptional curated moments that blend luxury ground transportation 
                with Atlanta's finest dining, cultural events, and bespoke celebrations.
              </p>
              
              <p style="margin-bottom: 20px;">
                As an early subscriber, you will receive:
              </p>
              
              <ul style="margin-bottom: 30px; padding-left: 20px;">
                <li style="margin-bottom: 10px;">Priority access when we launch</li>
                <li style="margin-bottom: 10px;">Exclusive invitations to preview experiences</li>
                <li style="margin-bottom: 10px;">Special member pricing on select offerings</li>
              </ul>
              
              <p style="margin-bottom: 20px;">
                We will be in touch soon with more details.
              </p>
              
              <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #C9A961;">
                <p style="font-size: 14px; color: #999; margin: 0;">
                  King & Carter Premier<br>
                  Atlanta, Georgia<br>
                  <a href="mailto:info@kingandcarter.com" style="color: #C9A961; text-decoration: none;">info@kingandcarter.com</a>
                </p>
              </div>
            </div>
          </div>
        `,
      }),
    })

    if (!emailResponse.ok) {
      const error = await emailResponse.text()
      console.error('Resend API error:', error)
      // Don't throw error - subscriber is saved even if email fails
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Successfully subscribed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
