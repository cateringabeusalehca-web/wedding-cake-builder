import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TierConfig {
  tierLevel: number;
  tierLabel: string;
  sizeInches: number;
  servings: number;
  sponge: string;
  dietary: string;
  filling: string;
}

interface OrderEmailRequest {
  client: {
    fullName: string;
    email: string;
    phone: string;
    eventDate: string;
    eventType: string;
  };
  project: {
    guestCount: number;
    structure: {
      id: string;
      name: string;
      tierCount: number;
      totalServings: number;
    };
    estimatedQuote: number;
    tiersConfiguration: TierConfig[];
    frosting: string;
    decoration: string;
    floralPalette: string | null;
    topper: string;
  };
  blindSpotCheck: {
    requiresSavoryBites: boolean;
    additionalNotes: string;
  };
  assets: {
    inspirationUrls: string[];
  };
}

const generateEmailHtml = (order: OrderEmailRequest): string => {
  const tiersHtml = order.project.tiersConfiguration
    .map(
      (tier) => `
      <tr style="border-bottom: 1px solid #e5e5e5;">
        <td style="padding: 12px; font-weight: 600;">${tier.tierLabel}</td>
        <td style="padding: 12px;">${tier.sizeInches}" (${tier.servings} servings)</td>
        <td style="padding: 12px;">${tier.sponge}</td>
        <td style="padding: 12px;">${tier.dietary}</td>
        <td style="padding: 12px;">${tier.filling}</td>
      </tr>
    `
    )
    .join("");

  const eventDate = new Date(order.client.eventDate).toLocaleDateString("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Cake Order Request</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background-color: #faf9f7;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 700px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 32px; text-align: center;">
            <h1 style="color: #d4a574; margin: 0; font-size: 28px; font-weight: 400; letter-spacing: 2px;">
              ✨ NEW CAKE ORDER REQUEST
            </h1>
            <p style="color: #a0a0a0; margin: 8px 0 0 0; font-size: 14px;">
              ${new Date().toLocaleString("en-CA")}
            </p>
          </td>
        </tr>

        <!-- Client Information -->
        <tr>
          <td style="padding: 32px;">
            <h2 style="color: #1a1a1a; font-size: 18px; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #d4a574; padding-bottom: 10px;">
              Client Information
            </h2>
            <table width="100%" cellpadding="8" cellspacing="0">
              <tr>
                <td style="width: 120px; color: #666; font-size: 14px;">Name:</td>
                <td style="font-size: 16px; font-weight: 600;">${order.client.fullName}</td>
              </tr>
              <tr>
                <td style="color: #666; font-size: 14px;">Email:</td>
                <td><a href="mailto:${order.client.email}" style="color: #d4a574; text-decoration: none;">${order.client.email}</a></td>
              </tr>
              <tr>
                <td style="color: #666; font-size: 14px;">Phone:</td>
                <td><a href="tel:${order.client.phone}" style="color: #d4a574; text-decoration: none;">${order.client.phone}</a></td>
              </tr>
              <tr>
                <td style="color: #666; font-size: 14px;">Event Type:</td>
                <td style="font-size: 16px;">${order.client.eventType}</td>
              </tr>
              <tr>
                <td style="color: #666; font-size: 14px;">Event Date:</td>
                <td style="font-size: 16px; font-weight: 600; color: #d4a574;">${eventDate}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Cake Summary -->
        <tr>
          <td style="padding: 0 32px 32px 32px;">
            <h2 style="color: #1a1a1a; font-size: 18px; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #d4a574; padding-bottom: 10px;">
              Cake Design Summary
            </h2>
            <table width="100%" cellpadding="12" cellspacing="0" style="background-color: #faf9f7; border-radius: 8px;">
              <tr>
                <td style="width: 50%; border-right: 1px solid #e5e5e5;">
                  <span style="color: #666; font-size: 12px; text-transform: uppercase;">Structure</span><br>
                  <strong style="font-size: 18px;">${order.project.structure.name}</strong>
                </td>
                <td style="width: 50%; padding-left: 20px;">
                  <span style="color: #666; font-size: 12px; text-transform: uppercase;">Servings</span><br>
                  <strong style="font-size: 18px;">${order.project.structure.totalServings} guests</strong>
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding-top: 20px; text-align: center; border-top: 1px solid #e5e5e5;">
                  <span style="color: #666; font-size: 12px; text-transform: uppercase;">Estimated Quote</span><br>
                  <strong style="font-size: 32px; color: #d4a574;">$${order.project.estimatedQuote.toFixed(0)}</strong>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Tier Details -->
        <tr>
          <td style="padding: 0 32px 32px 32px;">
            <h2 style="color: #1a1a1a; font-size: 18px; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #d4a574; padding-bottom: 10px;">
              Tier Configuration
            </h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px;">
              <thead>
                <tr style="background-color: #1a1a1a; color: #ffffff;">
                  <th style="padding: 12px; text-align: left;">Tier</th>
                  <th style="padding: 12px; text-align: left;">Size</th>
                  <th style="padding: 12px; text-align: left;">Sponge</th>
                  <th style="padding: 12px; text-align: left;">Dietary</th>
                  <th style="padding: 12px; text-align: left;">Filling</th>
                </tr>
              </thead>
              <tbody>
                ${tiersHtml}
              </tbody>
            </table>
          </td>
        </tr>

        <!-- Finishes -->
        <tr>
          <td style="padding: 0 32px 32px 32px;">
            <h2 style="color: #1a1a1a; font-size: 18px; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #d4a574; padding-bottom: 10px;">
              Finishes & Decoration
            </h2>
            <table width="100%" cellpadding="8" cellspacing="0">
              <tr>
                <td style="width: 140px; color: #666; font-size: 14px;">Frosting:</td>
                <td style="font-size: 16px;">${order.project.frosting}</td>
              </tr>
              <tr>
                <td style="color: #666; font-size: 14px;">Decoration Style:</td>
                <td style="font-size: 16px;">${order.project.decoration}</td>
              </tr>
              ${order.project.floralPalette ? `
              <tr>
                <td style="color: #666; font-size: 14px;">Floral Palette:</td>
                <td style="font-size: 16px;">${order.project.floralPalette}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="color: #666; font-size: 14px;">Topper:</td>
                <td style="font-size: 16px;">${order.project.topper}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Additional Info -->
        ${order.blindSpotCheck.requiresSavoryBites || order.blindSpotCheck.additionalNotes ? `
        <tr>
          <td style="padding: 0 32px 32px 32px;">
            <h2 style="color: #1a1a1a; font-size: 18px; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #d4a574; padding-bottom: 10px;">
              Additional Requests
            </h2>
            ${order.blindSpotCheck.requiresSavoryBites ? `
            <p style="background-color: #d4a574; color: #1a1a1a; padding: 12px; border-radius: 4px; margin: 0 0 12px 0;">
              ✓ <strong>Interested in Savory Bites / Dessert Table add-on</strong>
            </p>
            ` : ''}
            ${order.blindSpotCheck.additionalNotes ? `
            <div style="background-color: #faf9f7; padding: 16px; border-radius: 4px; border-left: 4px solid #d4a574;">
              <strong style="color: #666; font-size: 12px; text-transform: uppercase;">Client Notes:</strong>
              <p style="margin: 8px 0 0 0; line-height: 1.6;">${order.blindSpotCheck.additionalNotes}</p>
            </div>
            ` : ''}
          </td>
        </tr>
        ` : ''}

        <!-- Inspiration References -->
        ${order.assets.inspirationUrls.length > 0 ? `
        <tr>
          <td style="padding: 0 32px 32px 32px;">
            <h2 style="color: #1a1a1a; font-size: 18px; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #d4a574; padding-bottom: 10px;">
              Inspiration References
            </h2>
            <p style="color: #666; font-size: 14px; margin: 0;">
              Client uploaded ${order.assets.inspirationUrls.length} reference image(s): ${order.assets.inspirationUrls.join(', ')}
            </p>
          </td>
        </tr>
        ` : ''}

        <!-- Footer -->
        <tr>
          <td style="background-color: #1a1a1a; padding: 24px; text-align: center;">
            <p style="color: #a0a0a0; margin: 0; font-size: 12px;">
              This order was submitted via the Wedding Cake Builder
            </p>
            <p style="color: #666; margin: 8px 0 0 0; font-size: 11px;">
              Reply directly to this email to contact the client at ${order.client.email}
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  console.log("send-order-email function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderData: OrderEmailRequest = await req.json();
    console.log("Order received:", JSON.stringify(orderData, null, 2));

    const htmlContent = generateEmailHtml(orderData);

    // Send email to orders inbox
    const emailResponse = await resend.emails.send({
      from: "Cake Design Studio <orders@cateringabeusaleh.ca>",
      to: ["orders@cateringabeusaleh.ca"],
      reply_to: orderData.client.email,
      subject: `🎂 New Cake Order: ${orderData.client.fullName} - ${orderData.client.eventType} (${orderData.project.structure.name})`,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    // Also send confirmation to client
    const clientConfirmationHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>We Received Your Cake Design!</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background-color: #faf9f7;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px; text-align: center;">
              <h1 style="color: #d4a574; margin: 0; font-size: 24px; font-weight: 400; letter-spacing: 2px;">
                ✨ Thank You, ${orderData.client.fullName}!
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="font-size: 16px; line-height: 1.8; color: #333; margin: 0 0 20px 0;">
                We've received your custom cake design request and are excited to bring your vision to life!
              </p>
              <div style="background-color: #faf9f7; padding: 24px; border-radius: 8px; text-align: center; margin: 24px 0;">
                <span style="color: #666; font-size: 12px; text-transform: uppercase;">Your Design</span><br>
                <strong style="font-size: 20px; color: #1a1a1a;">${orderData.project.structure.name}</strong><br>
                <span style="color: #d4a574; font-size: 24px; font-weight: 600;">$${orderData.project.estimatedQuote.toFixed(0)}</span>
                <span style="color: #666; font-size: 14px;"> estimated</span>
              </div>
              <p style="font-size: 16px; line-height: 1.8; color: #333; margin: 0 0 20px 0;">
                Our atelier will review your specifications and reach out within <strong>24-48 hours</strong> to confirm details and finalize your quote.
              </p>
              <p style="font-size: 14px; color: #666; margin: 0;">
                If you have any questions, simply reply to this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #1a1a1a; padding: 24px; text-align: center;">
              <p style="color: #d4a574; margin: 0; font-size: 14px; letter-spacing: 1px;">
                ABE U-SALEH CATERING
              </p>
              <p style="color: #666; margin: 8px 0 0 0; font-size: 12px;">
                Cake Design Studio
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const clientEmailResponse = await resend.emails.send({
      from: "Abe U-Saleh Catering <orders@cateringabeusaleh.ca>",
      to: [orderData.client.email],
      subject: "✨ We Received Your Cake Design Request!",
      html: clientConfirmationHtml,
    });

    console.log("Client confirmation sent:", clientEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        orderId: emailResponse.data?.id ?? "sent",
        clientEmailId: clientEmailResponse.data?.id ?? "sent"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-order-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
