import nodemailer from "nodemailer";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://www.ceylonjojotravels.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    country,
    travelers,
    tour,
    orderNumber,
    total,
    bookingDate,
    travelDate,
  } = req.body;

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

    const mailOptions = {
      from: `"Tour Booking" <${process.env.EMAIL_USER}>`,
      to: adminEmails,
      subject: `New Booking Received - ${orderNumber}`,
      html: `
      <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; padding: 30px;">
        <div style="max-width: 700px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <div style="background-color: #1e3a8a; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px;">
              New Booking Notification
            </h1>
            <p style="color: #cbd5e1; margin: 5px 0 0; font-size: 14px;">
              CEYLON JOJO TRAVElS - Booking System
            </p>
          </div>

          <!-- Body -->
          <div style="padding: 30px;">
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              A new tour booking has been successfully placed. Please review the details below:
            </p>

            <!-- Booking Info -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Order Number:</td>
                <td>${orderNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Booking Date:</td>
                <td>${new Date(bookingDate).toLocaleString()}</td>
              </tr>
            </table>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;" />

            <!-- Customer Info -->
            <h2 style="font-size: 18px; margin-bottom: 15px; color: #1e3a8a;">
              Customer Information
            </h2>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Full Name:</td>
                <td>${firstName} ${lastName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Email:</td>
                <td>${email}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Phone:</td>
                <td>${phone}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Country:</td>
                <td>${country}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Number of Travelers:</td>
                <td>${travelers}</td>
              </tr>
            </table>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;" />

            <!-- Tour Details -->
            <h2 style="font-size: 18px; margin-bottom: 15px; color: #1e3a8a;">
              Tour Details
            </h2>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Tour Name:</td>
                <td>${tour.title}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Duration:</td>
                <td>${tour.duration}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Travel Date:</td>
                <td>${new Date(travelDate).toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Total Amount:</td>
                <td style="color: #16a34a; font-weight: bold;">$${total}</td>
              </tr>
            </table>

            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
              Please review this booking and proceed with confirmation and tour arrangements.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
            © ${new Date().getFullYear()} CEYLON JOJO TRAVElS. All rights reserved.
          </div>

        </div>
      </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    const customerMailOptions = {
      from: '"CEYLON JOJO TRAVElS"',
      to: email,
      subject: `Thank you for your booking! - ${tour.title}`,
      html: `
      <div style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
        <div style="max-width:700px;margin:40px auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.05);">

          <!-- Header -->
          <div style="background-color:#1e3a8a;padding:25px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:22px;">
              Booking Confirmation
            </h1>
            <p style="color:#cbd5e1;margin:5px 0 0;font-size:14px;">
              CEYLON JOJO TRAVElS – Sri Lanka
            </p>
          </div>

          <!-- Body -->
          <div style="padding:30px;color:#333;">

            <p style="font-size:16px;">
              Dear ${firstName},
            </p>

            <p style="font-size:15px;line-height:1.6;">
              Thank you for choosing <strong>CEYLON JOJO TRAVElS</strong>. 
              Your booking has been successfully received and confirmed. 
              Below are your booking details for your reference.
            </p>

            <!-- Booking Details -->
            <h2 style="font-size:18px;margin-top:25px;color:#1e3a8a;">
              Booking Summary
            </h2>

            <table style="width:100%;border-collapse:collapse;margin-top:15px;">
              <tr>
                <td style="padding:10px;border:1px solid #e5e7eb;font-weight:bold;">Order Number</td>
                <td style="padding:10px;border:1px solid #e5e7eb;">${orderNumber}</td>
              </tr>
              <tr>
                <td style="padding:10px;border:1px solid #e5e7eb;font-weight:bold;">Tour</td>
                <td style="padding:10px;border:1px solid #e5e7eb;">${tour.title}</td>
              </tr>
              <tr>
                <td style="padding:10px;border:1px solid #e5e7eb;font-weight:bold;">Duration</td>
                <td style="padding:10px;border:1px solid #e5e7eb;">${tour.duration}</td>
              </tr>
              <tr>
                <td style="padding:10px;border:1px solid #e5e7eb;font-weight:bold;">Booking Date</td>
                <td style="padding:10px;border:1px solid #e5e7eb;">
                  ${new Date(bookingDate).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td style="padding:10px;border:1px solid #e5e7eb;font-weight:bold;">Total Amount</td>
                <td style="padding:10px;border:1px solid #e5e7eb;color:#16a34a;font-weight:bold;">
                  $${total}
                </td>
              </tr>
            </table>

            <p style="margin-top:25px;font-size:15px;line-height:1.6;">
              Our team will contact you shortly with further travel arrangements and important information 
              regarding your tour.
            </p>

            <p style="margin-top:20px;font-size:15px;">
              If you have any questions, please feel free to contact us.
            </p>

            <p style="margin-top:30px;font-size:15px;line-height:1.6;">
              Kind regards,<br/>
              <strong>CEYLON JOJO TRAVElS Team</strong><br/>
              No 111/3 , Dediyawala Rd, Mahawaskaduwa,<br/>
              Waskaduwa, Kalutara North,<br/>
              Sri Lanka
            </p>

            <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />

            <p style="font-size:14px;line-height:1.6;color:#555;">
              📞 WhatsApp: 
              <a href="https://wa.me/447375612946" 
                style="color:#1e3a8a;text-decoration:none;font-weight:bold;">
                +44 73 75 612 946
              </a><br/>
              
              📧 Email: 
              <a href="mailto:ceylonjojotravels@gmail.com" 
                style="color:#1e3a8a;text-decoration:none;">
                ceylonjojotravels@gmail.com
              </a>
            </p>
          </div>

          <!-- Footer -->
          <div style="background:#f1f5f9;padding:15px;text-align:center;font-size:12px;color:#6b7280;">
            © ${new Date().getFullYear()} CEYLON JOJO TRAVElS. All rights reserved.
          </div>

        </div>
      </div>
      `,
    };

    await transporter.sendMail(customerMailOptions);

    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error sending email", error });
  }
}
