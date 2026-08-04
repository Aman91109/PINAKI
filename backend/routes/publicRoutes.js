const express = require('express');
const router = express.Router();
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
  <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 24px; color: #1f2937; max-width: 600px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
    <h2 style="color: #4f46e5; margin-top: 0; border-bottom: 2px solid #6366f1; padding-bottom: 8px;">
      📥 New Project Inquiry (Step 9)
    </h2>
    <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
      <tr><td style="padding: 6px 0; font-weight: bold; width: 130px;">Name:</td><td>${lead.name}</td></tr>
      <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td><a href="mailto:${lead.email}" style="color: #4f46e5; font-weight: bold;">${lead.email}</a></td></tr>
      <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td>${lead.phone || 'N/A'}</td></tr>
      <tr><td style="padding: 6px 0; font-weight: bold;">Company:</td><td>${lead.company || 'N/A'}</td></tr>
      <tr><td style="padding: 6px 0; font-weight: bold;">Project Type:</td><td><span style="background-color: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 4px; font-weight: 600;">${lead.projectType || 'N/A'}</span></td></tr>
      <tr><td style="padding: 6px 0; font-weight: bold;">Budget Range:</td><td>${lead.budget || 'N/A'}</td></tr>
    </table>
    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
    <h3 style="color: #111827; margin-bottom: 8px;">Message / Project Brief:</h3>
    <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #6366f1; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${lead.message}</div>
    ${lead.fileAttachment ? `<p style="margin-top: 16px;"><strong>Attachment:</strong> <a href="${lead.fileAttachment}">${lead.fileAttachment}</a></p>` : ''}
    <div style="margin-top: 24px; font-size: 12px; color: #6b7280; border-top: 1px solid #f3f4f6; padding-top: 12px;">
      Sent automatically from your Portfolio Contact Form (Step 9). Click "Reply" in your email app to reply directly to ${lead.email}.
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

// Helper: Send email notification — tries 3 SMTP strategies + Web3Forms fallback
const sendEmailAlert = async (lead) => {
  const recipientEmail = process.env.EMAIL_TO || 'pinaki.sna@gmail.com';

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

    // Strategy 1: service:'gmail' (lets Nodemailer pick the best port automatically)
    const result1 = await trySendMail(
      { service: 'gmail', auth: authConfig, ...timeouts, tls: { rejectUnauthorized: false } },
      mailOptions,
      'gmail-service'
    );
    if (result1) return { success: true, provider: 'nodemailer', messageId: result1.messageId };

    // Strategy 2: Port 465 / SSL (direct TLS)
    const result2 = await trySendMail(
      { host: 'smtp.gmail.com', port: 465, secure: true, auth: authConfig, ...timeouts, tls: { rejectUnauthorized: false } },
      mailOptions,
      'port-465-ssl'
    );
    if (result2) return { success: true, provider: 'nodemailer', messageId: result2.messageId };

    // Strategy 3: Port 587 / STARTTLS
    const result3 = await trySendMail(
      { host: 'smtp.gmail.com', port: 587, secure: false, auth: authConfig, ...timeouts, tls: { rejectUnauthorized: false } },
      mailOptions,
      'port-587-starttls'
    );
    if (result3) return { success: true, provider: 'nodemailer', messageId: result3.messageId };

    console.error('[EMAIL] All 3 SMTP strategies failed after retries.');
  }

  // Fallback: Web3Forms API (if WEB3FORMS_KEY is set in .env)
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

    if (global.useMockDB) {
      const lead = mockDb.create('Lead', {
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

      // Respond immediately, then send the email (handler stays alive until email completes)
      res.status(201).json({
        success: true,
        message: 'Inquiry submitted successfully! Our team will contact you shortly.',
        data: lead,
      });
      await sendEmailAlert(lead).catch(err => console.error('[EMAIL BG ERROR]', err.message));
      return;
    }

    // Mongoose execution
    const lead = await Lead.create({
      name,
      email,
      phone: phone || '',
      company: company || '',
      budget: budget || 'Not sure yet',
      projectType: projectType || 'Web application',
      message,
      fileAttachment: fileUrl,
    });

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

    if (global.useMockDB) {
      const existing = mockDb.findOne('Subscriber', { email });
      if (existing) {
        return res.status(400).json({ success: false, error: 'Email already subscribed!' });
      }

      mockDb.create('Subscriber', { email });

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
      return;
    }

    // Mongoose execution
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Email already subscribed!' });
    }

    await Subscriber.create({ email });

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
