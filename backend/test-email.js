require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('=== Email Configuration ===');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);
  console.log('EMAIL_TO:', process.env.EMAIL_TO);
  console.log('');

  // Use port 587 + STARTTLS (port 465/SSL has "Connection closed" issue on this network)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Step 1: Verify connection
  console.log('[1/2] Verifying SMTP connection...');
  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!\n');
  } catch (err) {
    console.error('❌ SMTP verification failed:', err.message);
    return;
  }

  // Step 2: Send the actual test email
  console.log('[2/2] Sending test email...');
  const recipientEmail = process.env.EMAIL_TO || 'pinaki.sna@gmail.com';

  const mailOptions = {
    from: `"Test Visitor via Portfolio" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: recipientEmail,
    replyTo: 'visitor@example.com',
    subject: `🚀 New Project Inquiry from Test Visitor (Web application)`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 24px; color: #1f2937; max-width: 600px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #4f46e5; margin-top: 0; border-bottom: 2px solid #6366f1; padding-bottom: 8px;">
          📥 New Project Inquiry
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr><td style="padding: 6px 0; font-weight: bold; width: 130px;">Name:</td><td>Test Visitor</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td><a href="mailto:visitor@example.com" style="color: #4f46e5; font-weight: bold;">visitor@example.com</a></td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td>+91 9508725672</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Company:</td><td>Test Company</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Project Type:</td><td><span style="background-color: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 4px; font-weight: 600;">Web application</span></td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Budget Range:</td><td>₹1,00,000 – ₹3,00,000</td></tr>
        </table>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <h3 style="color: #111827; margin-bottom: 8px;">Message / Project Brief:</h3>
        <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #6366f1; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">This is an automated test message to verify email delivery to ${recipientEmail} is working correctly from the portfolio contact form.</div>
        <div style="margin-top: 24px; font-size: 12px; color: #6b7280; border-top: 1px solid #f3f4f6; padding-top: 12px;">
          Sent automatically from Portfolio Contact Form. Click "Reply" to reply directly to visitor@example.com.
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('');
    console.log('===========================================');
    console.log('✅ EMAIL SENT SUCCESSFULLY!');
    console.log('===========================================');
    console.log('MessageId:', info.messageId);
    console.log('Response:', info.response);
    console.log('Accepted:', info.accepted);
    console.log('Rejected:', info.rejected);
    console.log('Envelope:', JSON.stringify(info.envelope));
    console.log('===========================================');
  } catch (err) {
    console.error('❌ SEND ERROR:', err.message);
    if (err.message.includes('Invalid login') || err.message.includes('Username and Password not accepted')) {
      console.error('👉 TIP: Gmail requires a 16-character App Password (not your normal password).');
      console.error('   Generate one at: https://myaccount.google.com/apppasswords');
    }
  }
}

testEmail();
