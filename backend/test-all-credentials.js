require('dotenv').config();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Anthropic = require('@anthropic-ai/sdk');

async function testAll() {
  console.log('====================================================');
  console.log('   COMPREHENSIVE CREDENTIALS & SERVICE HEALTH CHECK  ');
  console.log('====================================================\n');

  const results = {
    resend: { status: 'PENDING' },
    mongodb: { status: 'PENDING' },
    anthropic: { status: 'PENDING' },
    gmailSmtp: { status: 'PENDING' }
  };

  // 1. TEST RESEND API
  console.log('----------------------------------------------------');
  const resendApiKey = process.env.RESEND_API_KEY;
  console.log(`Resend API Key: ${resendApiKey ? resendApiKey.substring(0, 10) + '...' : 'NOT CONFIGURED'}`);
  
  try {
    const toEmail = process.env.EMAIL_TO || 'pinaki.sna@gmail.com';
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'Portfolio <onboarding@resend.dev>',
        to: [toEmail],
        subject: '🚀 Resend Email Test - Freelancing Portfolio',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #4f46e5; margin-top: 0;">✅ Resend Email Integration Verified!</h2>
            <p style="font-size: 15px; color: #334155;">Hello <strong>Pinaki</strong>,</p>
            <p style="font-size: 14px; color: #475569; line-height: 1.6;">
              Your <strong>Resend API Key</strong> is active and delivering emails flawlessly to <code>${toEmail}</code>.
            </p>
            <div style="background: #f8fafc; border-left: 4px solid #4f46e5; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
              <p style="margin: 0; font-size: 13px; color: #64748b;"><strong>Provider:</strong> Resend API (Transactional Email)</p>
              <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;"><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            </div>
            <p style="font-size: 13px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 12px; margin-top: 20px;">
              Sent from your Agency Portfolio Backend.
            </p>
          </div>
        `
      })
    });
    
    const data = await res.json();
    if (res.ok && data.id) {
      console.log('✅ Resend Email Sent Successfully!');
      console.log(`   Message ID: ${data.id}`);
      results.resend = { status: 'SUCCESS', id: data.id, message: 'Email sent successfully via Resend API' };
    } else {
      console.error('❌ Resend API Error:', data);
      results.resend = { status: 'FAILED', error: data.message || JSON.stringify(data) };
    }
  } catch (err) {
    console.error('❌ Resend Network/Execution Error:', err.message);
    results.resend = { status: 'FAILED', error: err.message };
  }
  console.log('');

  // 2. TEST MONGODB CONNECTION
  console.log('----------------------------------------------------');
  console.log('2. TESTING MONGODB ATLAS CONNECTION');
  console.log('----------------------------------------------------');
  const mongoUri = process.env.MONGODB_URI;
  console.log(`MongoDB URI: ${mongoUri ? mongoUri.replace(/:([^@]+)@/, ':****@') : 'NOT CONFIGURED'}`);

  try {
    const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log(`✅ MongoDB Connected Successfully to Host: ${conn.connection.host}`);
    console.log(`   Database Name: ${conn.connection.name || 'admin'}`);
    results.mongodb = { status: 'SUCCESS', host: conn.connection.host };
    await mongoose.disconnect();
  } catch (err) {
    console.error(`❌ MongoDB Connection Failed: ${err.message}`);
    results.mongodb = { status: 'FAILED', error: err.message };
  }
  console.log('');

  // 3. TEST ANTHROPIC API KEY
  console.log('----------------------------------------------------');
  console.log('3. TESTING ANTHROPIC CLAUDE API KEY');
  console.log('----------------------------------------------------');
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  console.log(`Anthropic API Key: ${anthropicKey ? anthropicKey.substring(0, 15) + '...' : 'NOT CONFIGURED'}`);

  try {
    const anthropic = new Anthropic({ apiKey: anthropicKey });
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 20,
      messages: [{ role: 'user', content: 'Say "Anthropic API Key is active!"' }]
    });
    console.log('✅ Anthropic Claude API Working!');
    console.log(`   Response: "${response.content[0]?.text?.trim()}"`);
    results.anthropic = { status: 'SUCCESS', response: response.content[0]?.text?.trim() };
  } catch (err) {
    console.error(`❌ Anthropic API Failed: ${err.message}`);
    results.anthropic = { status: 'FAILED', error: err.message };
  }
  console.log('');

  // 4. TEST GMAIL SMTP NODEMAILER
  console.log('----------------------------------------------------');
  console.log('4. TESTING GMAIL SMTP (BACKUP EMAIL CHANNEL)');
  console.log('----------------------------------------------------');
  console.log(`Gmail User: ${process.env.EMAIL_USER}`);
  console.log(`Gmail Pass: ${process.env.EMAIL_PASS ? '******** (' + process.env.EMAIL_PASS.length + ' chars)' : 'NOT SET'}`);

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 5000
    });
    await transporter.verify();
    console.log('✅ Gmail SMTP Connection Verified!');
    results.gmailSmtp = { status: 'SUCCESS', message: 'SMTP credentials verified' };
  } catch (err) {
    console.error(`⚠️ Gmail SMTP Verification Notice: ${err.message}`);
    results.gmailSmtp = { status: 'NOTICE', error: err.message };
  }
  console.log('');

  // SUMMARY
  console.log('====================================================');
  console.log('                 FINAL CREDENTIAL SUMMARY            ');
  console.log('====================================================');
  console.log(`1. Resend API Key:      [${results.resend.status}]`);
  console.log(`2. MongoDB Atlas:       [${results.mongodb.status}]`);
  console.log(`3. Anthropic Claude AI: [${results.anthropic.status}]`);
  console.log(`4. Gmail SMTP Backup:   [${results.gmailSmtp.status}]`);
  console.log('====================================================\n');
}

testAll();
