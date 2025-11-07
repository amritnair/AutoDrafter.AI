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
    const { description } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    if (!description || description.trim().length === 0) {
      throw new Error('Product description is required');
    }

    console.log('Generating documentation for:', description.substring(0, 100));

    // Generate each section with specialized prompts
    const sections = [
      {
        key: 'circuits',
        prompt: `As an electrical engineer, create detailed circuit diagrams and specifications for: ${description}

Include:
- Power requirements and calculations
- Component list with specifications
- Circuit topology and connections
- Safety considerations
- PCB layout recommendations
- Testing procedures`
      },
      {
        key: 'cad',
        prompt: `As a mechanical engineer, provide comprehensive CAD modeling instructions for: ${description}

Include:
- Dimensional specifications
- Material selection rationale
- Assembly structure
- Tolerance requirements
- Manufacturing considerations
- 3D modeling workflow steps`
      },
      {
        key: 'build',
        prompt: `As a manufacturing specialist, create step-by-step build instructions for: ${description}

Include:
- Required tools and materials
- Detailed assembly sequence
- Quality checkpoints
- Troubleshooting tips
- Safety precautions
- Time estimates for each step`
      },
      {
        key: 'design',
        prompt: `As an industrial designer, provide design guidelines for: ${description}

Include:
- Aesthetic considerations
- Ergonomics and user experience
- Form factor recommendations
- Color and material palette
- Branding opportunities
- Design iteration suggestions`
      },
      {
        key: 'marketing',
        prompt: `As a marketing strategist, develop a go-to-market strategy for: ${description}

Include:
- Target market analysis
- Competitive positioning
- Pricing strategy
- Distribution channels
- Marketing campaign ideas
- Social media strategy
- Key messaging points`
      },
      {
        key: 'pitch',
        prompt: `As a business consultant, create an investor pitch deck outline for: ${description}

Include:
- Problem statement
- Solution overview
- Market opportunity
- Competitive advantages
- Business model
- Financial projections
- Team requirements
- Funding ask and use of funds`
      }
    ];

    const results: any = {};

    // Generate all sections in parallel for speed
    const promises = sections.map(async (section) => {
      try {
        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: 'You are an expert technical writer and product development specialist. Provide detailed, practical, and actionable content. Format your responses in clear sections with headers and bullet points.'
              },
              {
                role: 'user',
                content: section.prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 2000,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error generating ${section.key}:`, response.status, errorText);
          throw new Error(`Failed to generate ${section.key}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        
        if (!content) {
          throw new Error(`No content generated for ${section.key}`);
        }

        results[section.key] = content;
        console.log(`Successfully generated ${section.key}`);
      } catch (error) {
        console.error(`Error in ${section.key}:`, error);
        results[section.key] = `Error generating ${section.key} content. Please try again.`;
      }
    });

    await Promise.all(promises);

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-product-docs:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});