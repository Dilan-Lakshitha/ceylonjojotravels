import nodemailer from "nodemailer";

const ALLOWED_ORIGINS = [
  "https://ceylonjojotravels.com",
  "https://www.ceylonjojotravels.com",
  "http://localhost:4200",
  "http://127.0.0.1:4200",
];

function setCors(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "https://ceylonjojotravels.com");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default async function handler(req, res) {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { name, email, contactPhone, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: name, email, message",
    });
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Contact email misconfigured: EMAIL_USER / EMAIL_PASS missing");
    return res.status(500).json({
      success: false,
      message: "Email service is not configured",
    });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(contactPhone || "Not provided");
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const adminEmails = [
      "ceylonjojotravels@gmail.com",
      "dilanlakshitha194@gmail.com",
      "danulanimneth@gmail.com",
    ];

    await transporter.sendMail({
      from: `"CEYLON JOJO TRAVElS Contact" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: adminEmails,
      subject: `New Contact Message from ${name}`,
      html: `
      <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; padding: 30px;">
        <div style="max-width: 640px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <div style="background-color: #023a2c; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px;">New Contact Message</h1>
            <p style="color: #cbd5e1; margin: 5px 0 0; font-size: 14px;">CEYLON JOJO TRAVElS — Website Contact Form</p>
          </div>
          <div style="padding: 28px;">
            <p style="font-size: 15px; margin-bottom: 20px;">A visitor submitted the contact form. Details below:</p>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 140px;">Name:</td>
                <td>${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                <td><a href="mailto:${safeEmail}">${safeEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Phone / WhatsApp:</td>
                <td>${safePhone}</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <h2 style="font-size: 16px; color: #023a2c; margin-bottom: 10px;">Message</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #334155;">${safeMessage}</p>
          </div>
          <div style="background-color: #f1f5f9; padding: 14px; text-align: center; font-size: 12px; color: #6b7280;">
            © ${new Date().getFullYear()} CEYLON JOJO TRAVElS. All rights reserved.
          </div>
        </div>
      </div>
      `,
    });

    await transporter.sendMail({
      from: `"CEYLON JOJO TRAVElS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `We received your message, ${name}`,
      html: `
      <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; padding: 30px;">
        <div style="max-width: 640px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <div style="background-color: #023a2c; padding: 22px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Message Received</h1>
            <p style="color: #cbd5e1; margin: 5px 0 0; font-size: 14px;">CEYLON JOJO TRAVElS — Sri Lanka</p>
          </div>
          <div style="padding: 28px; color: #333;">
            <p style="font-size: 16px;">Dear ${safeName},</p>
            <p style="font-size: 15px; line-height: 1.6;">
              Thank you for contacting <strong>CEYLON JOJO TRAVElS</strong>.
              We have received your message and our team will get back to you shortly.
            </p>
            <h2 style="font-size: 16px; color: #023a2c; margin-top: 24px;">Your message</h2>
            <p style="font-size: 15px; line-height: 1.6; background: #f8fafc; padding: 14px; border-radius: 8px;">${safeMessage}</p>
            <p style="margin-top: 24px; font-size: 15px; line-height: 1.6;">
              Kind regards,<br/>
              <strong>CEYLON JOJO TRAVElS Team</strong><br/>
              No 111/3, Dediyawala Rd, Maha Waskaduwa,<br/>
              Waskaduwa, Kalutara North, Sri Lanka
            </p>
            <p style="font-size: 14px; color: #555; margin-top: 18px;">
              WhatsApp:
              <a href="https://wa.me/447375612946" style="color:#023a2c;font-weight:bold;text-decoration:none;">+44 73 75 612 946</a><br/>
              Email:
              <a href="mailto:ceylonjojotravels@gmail.com" style="color:#023a2c;text-decoration:none;">ceylonjojotravels@gmail.com</a>
            </p>
          </div>
          <div style="background:#f1f5f9;padding:14px;text-align:center;font-size:12px;color:#6b7280;">
            © ${new Date().getFullYear()} CEYLON JOJO TRAVElS. All rights reserved.
          </div>
        </div>
      </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Contact emails sent successfully",
    });
  } catch (error) {
    console.error("Contact email error:", error);
    return res.status(500).json({
      success: false,
      message: "Error sending contact email",
    });
  }
}
