import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS configuration
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Sanitize and trim environment variables (remove whitespace and surrounding quotes)
    const fromEmail = (process.env.FROM_EMAIL || "").trim().replace(/^['"]|['"]$/g, "");
    const toEmail = (process.env.TO_EMAIL || "").trim().replace(/^['"]|['"]$/g, "");

    console.log("[Send Email] Raw process.env.FROM_EMAIL:", process.env.FROM_EMAIL);
    console.log("[Send Email] Sanitized fromEmail:", fromEmail);
    console.log("[Send Email] Sanitized toEmail:", toEmail);

    // Validate FROM_EMAIL
    if (!fromEmail || !fromEmail.includes("@")) {
      console.error("[Send Email] Missing or invalid FROM_EMAIL configuration.");
      return res.status(500).json({ error: "Sender email configuration (FROM_EMAIL) is missing or invalid in server environment." });
    }

    // Validate TO_EMAIL
    if (!toEmail || !toEmail.includes("@")) {
      console.error("[Send Email] Missing or invalid TO_EMAIL configuration.");
      return res.status(500).json({ error: "Recipient email configuration (TO_EMAIL) is missing or invalid in server environment." });
    }

    const { data, error } = await resend.emails.send({
      from: `Portfolio Contact From <${fromEmail}>`,
      to: toEmail,
      subject: `${subject} - from ${name}`,
      reply_to: email,
      html: `
        <div style="background-color: #0d1117; padding: 30px 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; min-height: 100%;">
          <div style="max-width: 580px; margin: 0 auto; background-color: #161b22; border: 1px solid #30363d; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);">
            
            <!-- Header with Tech Gradient Accent -->
            <div style="background: linear-gradient(135deg, #1f6feb 0%, #8957e5 100%); padding: 24px 30px; text-align: left;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #e1e4e8; font-weight: 600; margin-bottom: 4px;">Inbound Lead</div>
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">New Portfolio Message</h1>
            </div>

            <!-- Content Area -->
            <div style="padding: 30px;">
              
              <!-- Sender Metadata -->
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #21262d; width: 30%; color: #8b949e; font-size: 14px; font-weight: 500;">Sender Name</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #21262d; color: #c9d1d9; font-size: 14px; font-weight: 600; text-align: right;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #21262d; color: #8b949e; font-size: 14px; font-weight: 500;">Email Address</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #21262d; text-align: right;">
                    <a href="mailto:${email}" style="color: #58a6ff; font-size: 14px; font-weight: 600; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #21262d; color: #8b949e; font-size: 14px; font-weight: 500;">Subject</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #21262d; color: #c9d1d9; font-size: 14px; font-weight: 600; text-align: right;">${subject}</td>
                </tr>
              </table>

              <!-- Message Container -->
              <div style="margin-top: 20px;">
                <div style="color: #8b949e; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Message Content</div>
                <div style="background-color: #0d1117; border: 1px solid #30363d; border-radius: 8px; padding: 20px; color: #ecf2f8; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
              </div>

              <!-- Quick Action CTA Button -->
              <div style="margin-top: 30px; text-align: center;">
                <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" style="display: inline-block; background-color: #238636; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 6px; box-shadow: 0 4px 12px rgba(35, 134, 54, 0.2);">
                  Reply Directly
                </a>
              </div>

            </div>

            <!-- Footer -->
            <div style="background-color: #0d1117; border-top: 1px solid #30363d; padding: 20px 30px; text-align: center;">
              <div style="font-size: 11px; color: #8b949e; line-height: 1.5;">
                This email was sent dynamically from your portfolio contact form.<br>
                Source Domain: <a href="https://pavithraninfo.dev" style="color: #58a6ff; text-decoration: none;">pavithraninfo.dev</a>
              </div>
            </div>

          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API error details:", error);
      return res.status(400).json({ error: error.message || "Failed to send email via Resend" });
    }

    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error("Serverless function error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
