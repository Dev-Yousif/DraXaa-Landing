import nodemailer from "nodemailer";

// Create email transporter with production-ready configuration
const createTransporter = () => {
  const config = {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_PORT === "465", // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // Accept self-signed certificates
      ciphers: 'SSLv3'
    },
    // Add connection pooling for better performance
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
  };

  console.log("📧 Email config:", {
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.auth.user ? "✓" : "✗",
    pass: config.auth.pass ? "✓" : "✗",
  });

  return nodemailer.createTransport(config);
};

// Professional responsive email template with SVG icons
const getEmailTemplate = (leadData) => {
  const { name, email, phone, subject, message, createdAt } = leadData;

  return `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>New Lead - Draxaa</title>
  <!--[if mso]>
  <style>
    * { font-family: Arial, sans-serif !important; }
    table { border-collapse: collapse; }
  </style>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    @media only screen and (max-width: 600px) {
      .mobile-padding {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
      .mobile-text {
        font-size: 16px !important;
      }
      .mobile-title {
        font-size: 24px !important;
      }
      .mobile-logo {
        height: 45px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f5f7; width: 100%;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f5f7; padding: 40px 0;">
    <tr>
      <td align="center" style="padding: 0 20px;">

        <!-- Main Container -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #fe6019 0%, #ff7d42 100%); padding: 48px 40px; text-align: center;" class="mobile-padding">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <h2 style="margin: 0 0 24px; font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: 1px; text-transform: uppercase;">DRAXAA</h2>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; line-height: 1.3;" class="mobile-title">New Lead Received</h1>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 16px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background-color: rgba(255, 255, 255, 0.15); border-radius: 100px; margin: 0 auto;">
                      <tr>
                        <td style="padding: 10px 20px;">
                          <p style="margin: 0; font-size: 13px; color: #ffffff; font-weight: 500;">
                            ${new Date(createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })} at ${new Date(createdAt).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Section -->
          <tr>
            <td style="padding: 40px;" class="mobile-padding">

              <!-- Lead Info Grid -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">

                <!-- Name -->
                <tr>
                  <td style="padding-bottom: 16px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8f9fa; border-radius: 10px; border-left: 4px solid #fe6019;">
                      <tr>
                        <td style="padding: 20px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td width="50" valign="top" style="padding-right: 16px;">
                                <div style="width: 40px; height: 40px; background-color: #fe6019; border-radius: 8px; text-align: center; line-height: 40px; color: #ffffff; font-size: 20px; font-weight: 700;">👤</div>
                              </td>
                              <td valign="top">
                                <p style="margin: 0 0 4px; font-size: 11px; color: #6c757d; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Contact Name</p>
                                <p style="margin: 0; font-size: 16px; font-weight: 600; color: #212529; line-height: 1.4;" class="mobile-text">${name}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Email -->
                <tr>
                  <td style="padding-bottom: 16px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8f9fa; border-radius: 10px; border-left: 4px solid #fe6019;">
                      <tr>
                        <td style="padding: 20px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td width="50" valign="top" style="padding-right: 16px;">
                                <div style="width: 40px; height: 40px; background-color: #fe6019; border-radius: 8px; text-align: center; line-height: 40px; color: #ffffff; font-size: 20px; font-weight: 700;">✉</div>
                              </td>
                              <td valign="top">
                                <p style="margin: 0 0 4px; font-size: 11px; color: #6c757d; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email Address</p>
                                <p style="margin: 0; font-size: 16px; font-weight: 600; line-height: 1.4;" class="mobile-text">
                                  <a href="mailto:${email}" style="color: #fe6019; text-decoration: none;">${email}</a>
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                ${phone ? `
                <!-- Phone -->
                <tr>
                  <td style="padding-bottom: 16px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8f9fa; border-radius: 10px; border-left: 4px solid #fe6019;">
                      <tr>
                        <td style="padding: 20px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td width="50" valign="top" style="padding-right: 16px;">
                                <div style="width: 40px; height: 40px; background-color: #fe6019; border-radius: 8px; text-align: center; line-height: 40px; color: #ffffff; font-size: 20px; font-weight: 700;">📞</div>
                              </td>
                              <td valign="top">
                                <p style="margin: 0 0 4px; font-size: 11px; color: #6c757d; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Phone Number</p>
                                <p style="margin: 0; font-size: 16px; font-weight: 600; line-height: 1.4;" class="mobile-text">
                                  <a href="tel:${phone}" style="color: #fe6019; text-decoration: none;">${phone}</a>
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}

                ${subject ? `
                <!-- Subject -->
                <tr>
                  <td style="padding-bottom: 16px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8f9fa; border-radius: 10px; border-left: 4px solid #fe6019;">
                      <tr>
                        <td style="padding: 20px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td width="50" valign="top" style="padding-right: 16px;">
                                <div style="width: 40px; height: 40px; background-color: #fe6019; border-radius: 8px; text-align: center; line-height: 40px; color: #ffffff; font-size: 20px; font-weight: 700;">📄</div>
                              </td>
                              <td valign="top">
                                <p style="margin: 0 0 4px; font-size: 11px; color: #6c757d; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Subject</p>
                                <p style="margin: 0; font-size: 16px; font-weight: 600; color: #212529; line-height: 1.4;" class="mobile-text">${subject}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}

                <!-- Message -->
                <tr>
                  <td>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8f9fa; border-radius: 10px; border-left: 4px solid #fe6019;">
                      <tr>
                        <td style="padding: 20px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td width="50" valign="top" style="padding-right: 16px;">
                                <div style="width: 40px; height: 40px; background-color: #fe6019; border-radius: 8px; text-align: center; line-height: 40px; color: #ffffff; font-size: 20px; font-weight: 700;">💬</div>
                              </td>
                              <td valign="top">
                                <p style="margin: 0 0 8px; font-size: 11px; color: #6c757d; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
                                <p style="margin: 0; font-size: 15px; font-weight: 400; color: #495057; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 32px;">
                <tr>
                  <td align="center">
                    <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/leads" style="display: inline-block; padding: 16px 40px; background-color: #fe6019; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; text-align: center;">View in Dashboard</a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 32px 40px; text-align: center; border-top: 1px solid #e9ecef;" class="mobile-padding">
              <p style="margin: 0 0 8px; font-size: 14px; color: #6c757d; line-height: 1.5;">
                Automated notification from your Draxaa contact form
              </p>
              <p style="margin: 0; font-size: 13px; color: #adb5bd;">
                © ${new Date().getFullYear()} Draxaa. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

// Send lead notification email
export const sendLeadNotification = async (leadData) => {
  try {
    // Check if required environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error("❌ Email credentials not configured");
      console.error("Missing:", {
        EMAIL_USER: !process.env.EMAIL_USER,
        EMAIL_PASSWORD: !process.env.EMAIL_PASSWORD
      });
      return { success: false, error: "Email credentials not configured" };
    }

    const transporter = createTransporter();

    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log("✓ SMTP connection verified");
    } catch (verifyError) {
      console.error("❌ SMTP verification failed:", verifyError.message);
      // Continue anyway, sometimes verify fails but sending works
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Draxaa" <noreply@draxaa.com>',
      to: "yousifabdulmuti@gmail.com, mr.body.eg@gmail.com",
      subject: `🎯 New Lead: ${leadData.name} - ${leadData.subject || 'Contact Form'}`,
      html: getEmailTemplate(leadData),
    };

    console.log("📤 Sending email to:", mailOptions.to);

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email sending failed:");
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error stack:", error.stack);

    return { success: false, error: error.message };
  }
};
