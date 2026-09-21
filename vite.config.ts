import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { Resend } from "resend";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 3000,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    {
      name: "api-send-email-middleware",
      configureServer(server) {
        server.middlewares.use("/api/send-email", async (req, res) => {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
          res.setHeader("Access-Control-Allow-Headers", "Content-Type");

          if (req.method === "OPTIONS") {
            res.statusCode = 200;
            res.end();
            return;
          }

          if (req.method !== "POST") {
            res.statusCode = 405;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Method Not Allowed" }));
            return;
          }

          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });

          req.on("end", async () => {
            try {
              const { name, email, subject, message } = JSON.parse(body || "{}");
              if (!name || !email || !subject || !message) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Missing required fields" }));
                return;
              }

              const resendApiKey = process.env.RESEND_API_KEY;
              const fromEmail = (process.env.FROM_EMAIL || "").trim().replace(/^['"]|['"]$/g, "");
              const toEmail = (process.env.TO_EMAIL || "").trim().replace(/^['"]|['"]$/g, "");

              if (!resendApiKey) {
                // If API key is not yet set in environment, return a helpful notice
                console.log("[Dev Contact Form] Received message:", { name, email, subject, message });
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({
                  success: true,
                  message: "Message received in preview mode! To deliver real emails, configure RESEND_API_KEY, FROM_EMAIL, and TO_EMAIL."
                }));
                return;
              }

              if (!fromEmail || !toEmail) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Sender (FROM_EMAIL) or recipient (TO_EMAIL) configuration is missing." }));
                return;
              }

              const resend = new Resend(resendApiKey);
              const { data, error } = await resend.emails.send({
                from: `Portfolio Contact Form <${fromEmail}>`,
                to: toEmail,
                subject: `[Portfolio Contact] ${subject} - from ${name}`,
                reply_to: email,
                html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong><br/>${message}</p>`,
              });

              if (error) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: error.message || "Failed to send email via Resend" }));
                return;
              }

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: true, data }));
            } catch (err: unknown) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
              res.end(JSON.stringify({ error: errorMessage }));
            }
          });
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
