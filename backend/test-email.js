require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('====================================================');
  console.log('           PORTFOLIO EMAIL DELIVERY TEST            ');
  console.log('====================================================\n');

  const recipientEmail = process.env.EMAIL_TO || 'pinaki.sna@gmail.com';
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM || 'Portfolio Inquiry <onboarding@resend.dev>';

  console.log('Configuration:');
  console.log('- Recipient Email:', recipientEmail);
  console.log('- Resend API Key:', resendApiKey ? `${resendApiKey.substring(0, 10)}... (Configured)` : 'NOT SET');
  console.log('- Resend From Address:', resendFrom);
  console.log('- Gmail SMTP User:', process.env.EMAIL_USER || 'NOT SET');
  console.log('- Gmail SMTP Pass:', process.env.EMAIL_PASS ? `******** (${process.env.EMAIL_PASS.length} chars)` : 'NOT SET');
  console.log('');

  const emailHtml = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 24px; color: #1f2937; max-width: 600px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #4f46e5; margin-top: 0; border-bottom: 2px solid #6366f1; padding-bottom: 8px;">
        📥 New Project Inquiry (Resend Verified)
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        <tr><td style="padding: 6px 0; font-weight: bold; width: 130px;">Name:</td><td>Test Client</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td><a href="mailto:client@example.com" style="color: #4f46e5; font-weight: bold;">client@example.com</a></td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td>+91 9508725672</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Company:</td><td>Acme Studios</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Project Type:</td><td><span style="background-color: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 4px; font-weight: 600;">Full-Stack Web App</span></td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Budget Range:</td><td>₹1,00,000 – ₹3,00,000</td></tr>
      </table>
      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
      <h3 style="color: #111827; margin-bottom: 8px;">Message / Project Brief:</h3>
      <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #6366f1; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">
This is a live test from your Portfolio backend using your verified Resend API Key. All contact form inquiries and project proposals will be delivered instantly to ${recipientEmail}.
      </div>
      <div style="margin-top: 24px; font-size: 12px; color: #6b7280; border-top: 1px solid #f3f4f6; padding-top: 12px;">
        Sent automatically from Portfolio Contact Form. Click "Reply" to reply directly to the client.
      </div>
    </div>
  `;

  // 1. PRIMARY: Resend API Test
  console.log('[1/2] Testing Resend API delivery (Primary)...');
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: resendFrom,
          to: [recipientEmail],
          reply_to: 'client@example.com',
          subject: `🚀 Resend Live Verification - Project Inquiry from Test Client`,
          html: emailHtml,
        }),
      });

      const data = await res.json();
      if (res.ok && data.id) {
        console.log('====================================================');
        console.log('✅ RESEND EMAIL DELIVERED SUCCESSFULLY!');
        console.log('====================================================');
        console.log('Provider: Resend Transactional Email API');
        console.log('Message ID:', data.id);
        console.log('Recipient:', recipientEmail);
        console.log('From Address:', resendFrom);
        console.log('====================================================\n');
        return;
      } else {
        console.error('❌ Resend API Error:', data);
      }
    } catch (err) {
      console.error('❌ Resend Connection Error:', err.message);
    }
  } else {
    console.log('⚠️ RESEND_API_KEY not found in .env');
  }

  // 2. SECONDARY: Nodemailer Gmail SMTP Test (Fallback)
  console.log('\n[2/2] Testing Gmail SMTP delivery (Secondary/Fallback)...');
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: { rejectUnauthorized: false },
      });

      await transporter.verify();
      console.log('✅ SMTP Connection verified!');

      const info = await transporter.sendMail({
        from: `"Test Client via Portfolio" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to: recipientEmail,
        replyTo: 'client@example.com',
        subject: `🚀 SMTP Backup Verification - Project Inquiry from Test Client`,
        html: emailHtml,
      });

      console.log('====================================================');
      console.log('✅ GMAIL SMTP EMAIL DELIVERED SUCCESSFULLY!');
      console.log('====================================================');
      console.log('Provider: Gmail SMTP (Nodemailer)');
      console.log('Message ID:', info.messageId);
      console.log('Accepted:', info.accepted);
      console.log('====================================================\n');
    } catch (err) {
      console.error('❌ SMTP Error:', err.message);
    }
  } else {
    console.log('⚠️ EMAIL_USER or EMAIL_PASS not set in .env');
  }
}

testEmail();
