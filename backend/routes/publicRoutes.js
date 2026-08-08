const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { upload, uploadToCloudinary } = require('../middleware/uploadMiddleware');
const mockDb = require('../utils/mockDb');

// Models
const TeamMember = require('../models/TeamMember');
const Project = require('../models/Project');
const Testimonial = require('../models/Testimonial');
const Pricing = require('../models/Pricing');
const Blog = require('../models/Blog');
const Lead = require('../models/Lead');
const Subscriber = require('../models/Subscriber');
const Service = require('../models/Service');
const FAQ = require('../models/FAQ');

// Helper: Build the HTML email body from a lead object
const buildEmailHtml = (lead) => `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 32px 24px; color: #0f172a; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 20px;">
      <h2 style="color: #4f46e5; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">
        📥 New Client Inquiry — Pinaki Portfolio
      </h2>
    </div>

    <p style="margin: 0 0 16px 0; font-size: 15px; color: #475569;">
      A prospective client just submitted an inquiry on your portfolio website:
    </p>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 600; width: 120px;">Client Name:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${lead.name}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Email:</td>
          <td style="padding: 6px 0;"><a href="mailto:${lead.email}" style="color: #4f46e5; font-weight: 600; text-decoration: none;">${lead.email}</a></td>
        </tr>
        ${lead.company ? `
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Company:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${lead.company}</td>
        </tr>` : ''}
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Project Type:</td>
          <td style="padding: 6px 0;">
            <span style="display: inline-block; background-color: #e0e7ff; color: #3730a3; padding: 3px 10px; border-radius: 9999px; font-size: 12px; font-weight: 700;">
              ${lead.projectType || 'Web application'}
            </span>
          </td>
        </tr>
        ${lead.budget && lead.budget !== 'Not sure yet' ? `
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Budget:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${lead.budget}</td>
        </tr>` : ''}
        ${lead.phone ? `
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Phone:</td>
          <td style="padding: 6px 0; color: #0f172a;">${lead.phone}</td>
        </tr>` : ''}
      </table>
    </div>

    <div style="margin-bottom: 24px;">
      <h3 style="color: #1e293b; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0;">
        Project Brief / Message:
      </h3>
      <div style="background-color: #ffffff; border-left: 4px solid #4f46e5; border-radius: 4px; padding: 14px 16px; font-size: 14px; line-height: 1.6; color: #1e293b; white-space: pre-wrap; background: #fafafa; border: 1px solid #f1f5f9; border-left: 4px solid #4f46e5;">${lead.message}</div>
    </div>

    ${lead.fileAttachment ? `
    <div style="margin-bottom: 20px; font-size: 13px;">
      <strong>Attachment:</strong> <a href="${lead.fileAttachment}" target="_blank" style="color: #4f46e5; text-decoration: underline;">View Uploaded File</a>
    </div>` : ''}

    <div style="text-align: center; margin: 28px 0 16px 0;">
      <a href="mailto:${lead.email}?subject=Re:%20${encodeURIComponent(lead.projectType || 'Project Inquiry')}%20—%20Pinaki" 
         style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px; text-decoration: none; box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);">
        ✉️ Reply to ${lead.name} (${lead.email})
      </a>
    </div>

    <div style="margin-top: 28px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 14px; text-align: center;">
      Delivered instantly via Resend API to <strong>pinaki.sna@gmail.com</strong>. You can simply click "Reply" in your email client to message the client back directly.
    </div>
  </div>
`;

// Helper: Try sending mail with a given transporter config (with 1 retry)
const trySendMail = async (transportConfig, mailOptions, label) => {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const transporter = nodemailer.createTransport(transportConfig);
      const info = await transporter.sendMail(mailOptions);
      console.log(`[EMAIL SENT via ${label}] MessageId: ${info.messageId} (attempt ${attempt})`);
      return info;
    } catch (err) {
      console.warn(`[EMAIL ATTEMPT ${attempt}/2 via ${label}] ${err.message}`);
      if (attempt < 2) await new Promise(r => setTimeout(r, 1500)); // wait 1.5s before retry
    }
  }
  return null; // both attempts failed
};

// Helper: Send email notification — tries Resend API (Primary) -> SMTP (Secondary) -> Web3Forms (Fallback)
const sendEmailAlert = async (lead) => {
  const recipientEmail = process.env.EMAIL_TO || 'pinaki.sna@gmail.com';

  // Strategy 1: Resend API (Primary — Fast, reliable HTTP API with 99.9% inbox delivery)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const fromAddress = process.env.RESEND_FROM || 'Portfolio Inquiry <onboarding@resend.dev>';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [recipientEmail],
          reply_to: lead.email,
          subject: `🚀 New Project Inquiry from ${lead.name} (${lead.projectType || 'General'})`,
          html: buildEmailHtml(lead),
        }),
      });

      const data = await res.json();
      if (res.ok && data.id) {
        console.log(`[EMAIL SENT via Resend API] MessageId: ${data.id} -> ${recipientEmail}`);
        return { success: true, provider: 'resend', messageId: data.id };
      } else {
        console.warn('[RESEND API WARNING]', data.message || JSON.stringify(data));
      }
    } catch (err) {
      console.warn('[RESEND API ERROR]', err.message);
    }
  }

  // Strategy 2: Nodemailer / Gmail SMTP (Secondary)
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    const authConfig = {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    };

    const mailOptions = {
      from: `"${lead.name} via Portfolio" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: recipientEmail,
      replyTo: lead.email,
      subject: `🚀 New Project Inquiry from ${lead.name} (${lead.projectType || 'General'})`,
      html: buildEmailHtml(lead),
    };

    const timeouts = {
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    };

    // Attempt Port 587 / STARTTLS
    const result1 = await trySendMail(
      { host: 'smtp.gmail.com', port: 587, secure: false, auth: authConfig, ...timeouts, tls: { rejectUnauthorized: false } },
      mailOptions,
      'port-587-starttls'
    );
    if (result1) return { success: true, provider: 'nodemailer-587', messageId: result1.messageId };

    // Attempt service: 'gmail'
    const result2 = await trySendMail(
      { service: 'gmail', auth: authConfig, ...timeouts, tls: { rejectUnauthorized: false } },
      mailOptions,
      'gmail-service'
    );
    if (result2) return { success: true, provider: 'nodemailer-gmail', messageId: result2.messageId };

    // Attempt Port 465 / SSL
    const result3 = await trySendMail(
      { host: 'smtp.gmail.com', port: 465, secure: true, auth: authConfig, ...timeouts, tls: { rejectUnauthorized: false } },
      mailOptions,
      'port-465-ssl'
    );
    if (result3) return { success: true, provider: 'nodemailer-465', messageId: result3.messageId };

    console.error('[EMAIL] All 3 SMTP strategies failed after retries.');
  }

  // Strategy 3: Web3Forms API (Fallback if configured)
  const web3Key = process.env.WEB3FORMS_KEY || process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
  if (web3Key) {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: web3Key,
          subject: `🚀 New Project Inquiry from ${lead.name} (${lead.projectType || 'General'})`,
          from_name: lead.name,
          name: lead.name,
          email: lead.email,
          phone: lead.phone || '',
          company: lead.company || '',
          budget: lead.budget || '',
          projectType: lead.projectType || '',
          message: lead.message,
        }),
      });
      const data = await response.json();
      if (data.success) {
        console.log(`[EMAIL SENT VIA WEB3FORMS] Delivered to ${recipientEmail}`);
        return { success: true, provider: 'web3forms' };
      }
    } catch (err) {
      console.error('[WEB3FORMS ERROR]', err.message);
    }
  }

  // All methods failed
  console.log(`[EMAIL FAILED] All delivery methods exhausted for lead from ${lead.email}.`);
  return { success: false, reason: 'All email delivery methods failed' };
};

// @desc    Get all services
router.get('/services', async (req, res) => {
  try {
    if (global.useMockDB) {
      const services = mockDb.find('Service');
      // Sort alphabetically by name
      services.sort((a, b) => a.name.localeCompare(b.name));
      return res.status(200).json({ success: true, count: services.length, data: services });
    }
    const services = await Service.find().sort({ name: 1 });
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @desc    Get all FAQs
router.get('/faqs', async (req, res) => {
  try {
    if (global.useMockDB) {
      const faqs = mockDb.find('FAQ');
      faqs.sort((a, b) => a.order - b.order);
      return res.status(200).json({ success: true, count: faqs.length, data: faqs });
    }
    const faqs = await FAQ.find().sort({ order: 1 });
    res.status(200).json({ success: true, count: faqs.length, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @desc    Get all Team Members
router.get('/team', async (req, res) => {
  try {
    if (global.useMockDB) {
      const team = mockDb.find('TeamMember');
      return res.status(200).json({ success: true, count: team.length, data: team });
    }
    const team = await TeamMember.find();
    res.status(200).json({ success: true, count: team.length, data: team });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @desc    Get Portfolio items
router.get('/portfolio', async (req, res) => {
  try {
    const { category } = req.query;
    
    if (global.useMockDB) {
      let query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      const projects = mockDb.find('Project', query);
      // Sort by date (descending)
      projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.status(200).json({ success: true, count: projects.length, data: projects });
    }

    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    const projects = await Project.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @desc    Get Testimonials
router.get('/testimonials', async (req, res) => {
  try {
    if (global.useMockDB) {
      const testimonials = mockDb.find('Testimonial');
      return res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
    }
    const testimonials = await Testimonial.find();
    res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @desc    Get Pricing
router.get('/pricing', async (req, res) => {
  try {
    if (global.useMockDB) {
      const pricing = mockDb.find('Pricing');
      pricing.sort((a, b) => parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, '')));
      return res.status(200).json({ success: true, count: pricing.length, data: pricing });
    }
    const pricing = await Pricing.find().sort({ price: 1 });
    res.status(200).json({ success: true, count: pricing.length, data: pricing });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @desc    Get Blogs
router.get('/blogs', async (req, res) => {
  try {
    if (global.useMockDB) {
      const blogs = mockDb.find('Blog');
      blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.status(200).json({ success: true, count: blogs.length, data: blogs });
    }
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @desc    Get single Blog by slug
router.get('/blogs/:slug', async (req, res) => {
  try {
    if (global.useMockDB) {
      const blog = mockDb.findOne('Blog', { slug: req.params.slug });
      if (!blog) {
        return res.status(404).json({ success: false, error: 'Blog post not found' });
      }
      return res.status(200).json({ success: true, data: blog });
    }
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog post not found' });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @desc    Submit Contact Lead (with dynamic attachment)
router.post('/lead', upload.single('fileAttachment'), async (req, res) => {
  try {
    const { name, email, phone, company, budget, projectType, message } = req.body;

    let fileUrl = '';
    if (req.file) {
      const cloudinaryUrl = await uploadToCloudinary(req.file.path);
      fileUrl = cloudinaryUrl || `/uploads/${req.file.filename}`;
    }

    let lead;
    if (global.useMockDB || mongoose.connection.readyState !== 1) {
      lead = mockDb.create('Lead', {
        name,
        email,
        phone: phone || '',
        company: company || '',
        budget: budget || 'Not sure yet',
        projectType: projectType || 'Web application',
        message,
        fileAttachment: fileUrl,
        status: 'New',
      });
    } else {
      lead = await Lead.create({
        name,
        email,
        phone: phone || '',
        company: company || '',
        budget: budget || 'Not sure yet',
        projectType: projectType || 'Web application',
        message,
        fileAttachment: fileUrl,
      });
    }

    // Respond immediately, then send the email (handler stays alive until email completes)
    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully! Our team will contact you shortly.',
      data: lead,
    });
    await sendEmailAlert(lead).catch(err => console.error('[EMAIL BG ERROR]', err.message));
  } catch (error) {
    console.error('Lead submission error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @desc    Subscribe to Newsletter
router.post('/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Please provide an email address' });
    }

    if (global.useMockDB || mongoose.connection.readyState !== 1) {
      const existing = mockDb.findOne('Subscriber', { email });
      if (existing) {
        return res.status(400).json({ success: false, error: 'Email already subscribed!' });
      }
      mockDb.create('Subscriber', { email });
    } else {
      const existing = await Subscriber.findOne({ email });
      if (existing) {
        return res.status(400).json({ success: false, error: 'Email already subscribed!' });
      }
      await Subscriber.create({ email });
    }

    // Respond immediately, then send the email (handler stays alive until email completes)
    res.status(201).json({
      success: true,
      message: 'Subscribed to newsletter successfully!',
    });
    await sendEmailAlert({
      name: 'Newsletter Subscriber',
      email: email,
      phone: '',
      company: '',
      projectType: 'Newsletter Signup',
      message: `New newsletter subscription from: ${email}`,
    }).catch(err => console.error('[EMAIL BG ERROR]', err.message));
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @desc    Test Email Delivery to pinaki.sna@gmail.com
router.get('/test-email', async (req, res) => {
  try {
    const testLead = {
      name: 'Test Visitor',
      email: 'visitor@example.com',
      phone: '+91 9508725672',
      company: 'Test Company',
      budget: '₹1,00,000 – ₹3,00,000',
      projectType: 'Web application',
      message: 'This is an automated test message to verify email delivery to pinaki.sna@gmail.com.',
    };

    const emailStatus = await sendEmailAlert(testLead);

    if (emailStatus.success) {
      return res.status(200).json({
        success: true,
        message: 'Test email successfully sent to ' + (process.env.EMAIL_TO || 'pinaki.sna@gmail.com'),
        emailStatus,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Email delivery failed.',
        emailStatus,
        tip: 'Ensure EMAIL_PASS (16-char Google App Password) is set in backend/.env',
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
