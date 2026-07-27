'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, Mic } from 'lucide-react';

// ─────────────────────────────────────────────────────────
//  PINAKI AI HUB — Unified Chat + Voice Assistant
//  Text chatbot with knowledge base + ElevenLabs voice agent
//  in a single floating widget.
// ─────────────────────────────────────────────────────────

const ELEVENLABS_AGENT_ID = 'agent_1601kxmrsz2dfp8amphvhg2rbkkr';

type ActiveTab = 'chat' | 'voice';

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

// ── Knowledge Base: Every detail from the portfolio ──

const KNOWLEDGE_BASE: { keywords: string[]; response: string; priority: number }[] = [
  // ═══════════════════════════════════════════
  // GREETINGS & GENERAL
  // ═══════════════════════════════════════════
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good evening', 'good afternoon', 'sup', 'howdy', 'hola'],
    response: "Hey there! 👋 I'm Pinaki, your digital assistant from Pinaki Labs. I can help you with info about our services, team, process, portfolio, and how to get in touch. What would you like to know?",
    priority: 1,
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'later', 'thanks bye', 'talk later'],
    response: "Goodbye! 🚀 It was great chatting with you. If you need anything else, feel free to come back anytime. You can also reach us at pinaki.sna@gmail.com. Have an amazing day!",
    priority: 1,
  },
  {
    keywords: ['thank', 'thanks', 'thank you', 'thx', 'appreciate'],
    response: "You're welcome! 😊 Happy to help. If you have any more questions about our services, team, or anything else — just ask! We're always here for you.",
    priority: 1,
  },
  {
    keywords: ['who are you', 'what are you', 'your name', 'introduce', 'about you', 'what is pinaki'],
    response: "I'm **Pinaki** — the AI assistant for Pinaki Labs! 🤖 We're an elite collective of digital engineers who build premium, futuristic digital platforms and advanced AI infrastructures. We turn clicks into paying relationships. Ask me anything about our services, team, or how we work!",
    priority: 2,
  },
  {
    keywords: ['what do you do', 'what does pinaki do', 'what you offer', 'your work', 'company'],
    response: "Pinaki Labs engineers premium, futuristic digital platforms and advanced artificial intelligence infrastructures that convert clicks into paying relationships. We specialize in Web Development, AI/ML Solutions, UI/UX Design, Automation, and more. We've completed 120+ projects with a 99% success rate! 🚀",
    priority: 2,
  },

  // ═══════════════════════════════════════════
  // SERVICES — ALL 16 SERVICES
  // ═══════════════════════════════════════════
  {
    keywords: ['services', 'what services', 'offer', 'capabilities', 'what can you build', 'what do you build'],
    response: "We offer **16 next-gen services**:\n\n🌐 **Web Dev**: Website Development, Landing Pages, Business Websites, Portfolio Websites, E-Commerce\n🤖 **AI/ML**: AI Chatbots, Machine Learning, Deep Learning\n⚙️ **Engineering**: Python Automation, API Development, Dashboard Development\n🎨 **Design**: UI/UX Design, Graphic Design\n📈 **Growth**: SEO Optimization\n☁️ **Infrastructure**: Hosting & Deployment, Maintenance\n\nWant details on any specific service? Just ask!",
    priority: 3,
  },
  {
    keywords: ['website development', 'web development', 'website', 'web dev', 'build website', 'create website', 'make website', 'need website', 'want website'],
    response: "🌐 **Website Development** — We build custom, blazing-fast, and secure websites using Next.js & React.\n\n✅ Responsive Design\n✅ Next.js & React\n✅ SEO Friendly\n✅ High Performance\n\nOur websites are Awwwards-tier quality with modern animations, dark themes, and glassmorphism styling. Want to get started? Reach us at pinaki.sna@gmail.com!",
    priority: 4,
  },
  {
    keywords: ['landing page', 'landing'],
    response: "🎯 **Landing Pages** — Conversion-optimized landing pages that turn traffic into leads and customers.\n\n✅ Clear CTAs\n✅ A/B Tested Layouts\n✅ Super Fast Load\n✅ Analytics Integrated\n\nOur landing pages convert at massive rates — one client saw 18.5% conversion! Contact us at pinaki.sna@gmail.com to discuss your project.",
    priority: 4,
  },
  {
    keywords: ['business website', 'corporate website', 'company website', 'professional website'],
    response: "🏢 **Business Websites** — High-end websites that establish trust and command market authority.\n\n✅ Corporate Design\n✅ CMS Integration\n✅ Secure Hosting\n✅ Lead Capturing\n\nPerfect for companies looking to make a premium digital impression. Email us at pinaki.sna@gmail.com!",
    priority: 4,
  },
  {
    keywords: ['portfolio website', 'showcase', 'portfolio site'],
    response: "💼 **Portfolio Websites** — Premium showcase portfolios featuring modern animations and glassmorphism styling.\n\n✅ Cinematic Effects\n✅ Dark/Light Theme\n✅ Custom Curators\n✅ Smooth Scroll\n\nJust like the one you're on right now! Want your own? Reach out at pinaki.sna@gmail.com.",
    priority: 4,
  },
  {
    keywords: ['ecommerce', 'e-commerce', 'online store', 'shop', 'shopping', 'store'],
    response: "🛒 **E-Commerce** — Fully featured shopping experiences with custom checkouts, subscriptions, and panel boards.\n\n✅ Stripe Integration\n✅ Order Dashboards\n✅ Infinite Products\n✅ Inventory Control\n\nWe build scalable e-commerce platforms that grow with your business. Email pinaki.sna@gmail.com to get started!",
    priority: 4,
  },
  {
    keywords: ['chatbot', 'ai chatbot', 'bot', 'virtual assistant', 'chat agent'],
    response: "🤖 **AI Chatbots** — Intelligent, automated agents using ChatGPT / Claude APIs to engage visitors 24/7.\n\n✅ Context Retention\n✅ API Integrations\n✅ Custom Embeds\n✅ Human Handover\n\nJust like me! I'm a Pinaki chatbot. We can build one custom for your business too. Contact pinaki.sna@gmail.com!",
    priority: 4,
  },
  {
    keywords: ['machine learning', 'ml', 'predictive', 'regression', 'data science', 'analytics'],
    response: "🧠 **Machine Learning** — Advanced ML modeling, data analytics, predictive regression, and segmentation systems.\n\n✅ Python & PyTorch\n✅ Data Pipeline Dev\n✅ Model Optimization\n✅ Custom APIs\n\nOur ML models have achieved 92% accuracy for churn prediction for one client. Contact pinaki.sna@gmail.com to explore!",
    priority: 4,
  },
  {
    keywords: ['deep learning', 'neural network', 'cnn', 'rnn', 'transformer', 'nlp', 'computer vision', 'image recognition'],
    response: "🧬 **Deep Learning** — Complex neural networks for vision classification, text analysis, and NLP workloads.\n\n✅ CNNs & RNNs\n✅ Image Processing\n✅ Transformers Dev\n✅ High Accuracy Models\n\nWe work with PyTorch, TensorFlow, and custom architectures. Interested? Email pinaki.sna@gmail.com!",
    priority: 4,
  },
  {
    keywords: ['python automation', 'automation', 'scraping', 'web scraper', 'bot automation', 'script', 'automate'],
    response: "⚡ **Python Automation** — Custom web scrapers, data entry bots, reports automation, and workflow scripts.\n\n✅ Web Scraping\n✅ Zapier Automation\n✅ API Syncs\n✅ Custom Cron Jobs\n\nOne client replaced a 4-person team with our automation bots! Contact pinaki.sna@gmail.com to learn more.",
    priority: 4,
  },
  {
    keywords: ['api', 'api development', 'rest api', 'graphql', 'backend api', 'endpoint'],
    response: "🔌 **API Development** — Robust, fast, and scalable Node/Express REST & GraphQL endpoints with authentication.\n\n✅ JWT & OAuth\n✅ API Documentation\n✅ Rate Limiting\n✅ Highly Extensible\n\nOur APIs are built for scale with proper security. Contact pinaki.sna@gmail.com for your project!",
    priority: 4,
  },
  {
    keywords: ['dashboard', 'admin panel', 'cms', 'admin dashboard', 'control panel', 'monitoring'],
    response: "📊 **Dashboard Development** — Aesthetic, interactive monitoring consoles showcasing leads, analytics, and CRM charts.\n\n✅ Recharts Visuals\n✅ Real-time Feeds\n✅ Export Options\n✅ Custom Access Level\n\nWe deliver custom-tailored Admin Dashboard CMS where you can manage everything. Contact pinaki.sna@gmail.com!",
    priority: 4,
  },
  {
    keywords: ['ui', 'ux', 'ui/ux', 'design', 'figma', 'user interface', 'user experience', 'prototype', 'wireframe', 'mockup'],
    response: "🎨 **UI/UX Design** — Premium digital designs mapped in Figma utilizing futuristic Awwwards-style standards.\n\n✅ Figma Prototypes\n✅ User Journey Mapping\n✅ High-Fidelity Mockups\n✅ Component Libraries\n\nOur designs are Awwwards-tier with glassmorphic dark-theme layouts that command premium authority. Contact pinaki.sna@gmail.com!",
    priority: 4,
  },
  {
    keywords: ['graphic design', 'logo', 'branding', 'brand', 'graphics', 'vector', 'illustration'],
    response: "🖌️ **Graphic Design** — High-end branding, custom vectors, promotional material, and corporate logos.\n\n✅ Vector Graphics\n✅ Branding Booklets\n✅ Digital Artwork\n✅ Social Kits\n\nWe create visual identities that stand out. Reach us at pinaki.sna@gmail.com!",
    priority: 4,
  },
  {
    keywords: ['seo', 'search engine', 'ranking', 'google ranking', 'keywords', 'page speed', 'optimization'],
    response: "📈 **SEO Optimization** — Rigorous keyword research, speed auditing, and schema mappings to reach Page 1.\n\n✅ Site Audit\n✅ Schema Mappings\n✅ PageSpeed Boost\n✅ Keyword Rank Tracking\n\nWe make your website visible where it matters. Contact pinaki.sna@gmail.com!",
    priority: 4,
  },
  {
    keywords: ['hosting', 'deployment', 'deploy', 'server', 'aws', 'vercel', 'docker', 'cloud', 'devops', 'ci/cd'],
    response: "☁️ **Hosting & Deployment** — Vercel, Render, AWS, or Docker setup with CI/CD triggers and automated backups.\n\n✅ GitHub Actions\n✅ Zero Downtime\n✅ SSL Certificate Config\n✅ Scalable Cluster Setup\n\nWe deploy Next.js to Vercel, Node/Express to Render, and databases to MongoDB Atlas by default. Email pinaki.sna@gmail.com!",
    priority: 4,
  },
  {
    keywords: ['maintenance', 'support', 'bug fix', 'update', 'patch', 'upkeep'],
    response: "🛡️ **Maintenance** — Round-the-clock support, dependency patches, speed audits, and content updates.\n\n✅ Daily Backups\n✅ Package Audits\n✅ Bug Resolutions\n✅ 24x7 Monitor Alerts\n\nWe provide dedicated post-delivery maintenance. Reach out at pinaki.sna@gmail.com!",
    priority: 4,
  },

  // ═══════════════════════════════════════════
  // PRICING / COST — Direct Contact
  // ═══════════════════════════════════════════
  {
    keywords: ['price', 'pricing', 'cost', 'how much', 'budget', 'rate', 'charge', 'fee', 'expensive', 'affordable', 'cheap', 'quote', 'estimate', 'money'],
    response: "💬 **We don't have fixed price tags!**\n\nEvery project is unique, and we believe in transparent, personalised pricing. Our team will understand your exact requirements and share a custom quote — no hidden costs, no surprises.\n\n📞 **Call / WhatsApp us directly:**\n• +91 9508725672\n\n📧 **Email:** pinaki.sna@gmail.com\n\nJust reach out and we'll get back to you within a few hours! 🚀",
    priority: 5,
  },
  {
    keywords: ['starter plan', 'starter', 'basic plan', 'professional plan', 'pro plan', 'enterprise plan', 'enterprise', 'custom plan', 'large project', 'big project'],
    response: "🎯 **Custom Packages for Every Need:**\n\nWhether you're a student, startup, or an established business — we tailor our scope and pricing specifically for you.\n\n📞 **Talk to us directly:**\n• Call / WhatsApp: +91 9508725672\n• Email: pinaki.sna@gmail.com\n\nWe'll listen to your vision and craft the perfect plan! ✨",
    priority: 5,
  },


  // ═══════════════════════════════════════════
  // TEAM
  // ═══════════════════════════════════════════
  {
    keywords: ['team', 'who works', 'members', 'founders', 'directors', 'developers', 'engineers', 'people', 'staff', 'employees'],
    response: "👨‍💻 **Meet Our Team of Innovators:**\n\n**1. Somesh Kumar Mishra** — Full-Stack & GenAI Architect\n🏆 National SIH'24 Winner | President of MIT Coding Club\n📌 MERN, Socket.IO, Redis, Docker | 4+ Years | 28 Projects\n\n**2. Nishant Kumar** — Backend & ML Systems Engineer\n🏆 TCS NQT Top 5% | VP of MIT Coding Club\n📌 TypeScript, Node API, Python, NLP | 4+ Years | 35 Projects\n\n**3. Aman Kumar** — Researcher & Data Scientist\n📌 Deep Learning (CNNs), GenAI, OpenCV, Supabase | 3+ Years | 18 Projects\n\nWant to connect with any team member? Email pinaki.sna@gmail.com!",
    priority: 3,
  },
  {
    keywords: ['somesh', 'somesh kumar', 'somesh mishra'],
    response: "👨‍💻 **Somesh Kumar Mishra** — Full-Stack & GenAI Architect\n\n🏆 National SIH'24 Winner\n🎓 President of the MIT Coding Club\n🔧 Specializes in MERN applications, Socket.IO real-time channels, Redis caching, and custom multi-role validation\n📊 Skills: Next.js/React/TS (98%), Node.js & Socket.IO (95%), Docker & Cloud Deploy (90%)\n📈 4+ Years Experience | 28 Projects Completed\n🔗 GitHub: github.com/Somesh-Mishra-9\n🔗 LinkedIn: linkedin.com/in/somesh-mishra-ba2358219",
    priority: 4,
  },
  {
    keywords: ['nishant', 'nishant kumar'],
    response: "👨‍💻 **Nishant Kumar** — Backend & ML Systems Engineer\n\n🏆 TCS NQT Top 5% Ranker\n🎓 Vice President of the MIT Coding Club\n🔧 Expert in Next.js backend routing, REST endpoints, database structures, and PaddleOCR/Ollama NLP pipelines\n📊 Skills: TypeScript & Node API (97%), Python & NLP Models (95%), PostgreSQL & MongoDB (93%)\n📈 4+ Years Experience | 35 Projects Completed\n🔗 GitHub: github.com/nishant946\n🔗 LinkedIn: linkedin.com/in/nishant-kumar-a5b9a3258",
    priority: 4,
  },
  {
    keywords: ['aman', 'aman kumar'],
    response: "👨‍💻 **Aman Kumar** — Researcher & Data Scientist\n\n🎓 Event Coordinator at DTC Foss Club\n🔧 Expert in Deep Learning (CNNs), Generative AI models, image preprocessing using OpenCV, and Supabase analytics logging\n📊 Skills: Deep Learning & CNN (96%), Python & Data Analytics (94%), Cloud & Database Mappings (91%)\n📈 3+ Years Experience | 18 Projects Completed\n🔗 GitHub: github.com/Aman91109\n🔗 LinkedIn: linkedin.com/in/aman-kumar-735905321",
    priority: 4,
  },

  // ═══════════════════════════════════════════
  // PROCESS / METHODOLOGY
  // ═══════════════════════════════════════════
  {
    keywords: ['process', 'how you work', 'methodology', 'workflow', 'steps', 'approach', 'how does it work', 'phases', 'timeline'],
    response: "⚙️ **Our 7-Phase Development Process:**\n\n**Phase 01** — Requirement Discussion\nExhaustive consultation to define goals, scope, deadlines & budget.\n\n**Phase 02** — Planning & Architecture\nDatabase design, REST controllers, AI/ML model planning.\n\n**Phase 03** — UI/UX Visual Design\nInteractive Figma prototypes with glassmorphic dark-theme layouts.\n\n**Phase 04** — Code Development\nNext.js 15 frontend + Node/Express backend with JWT auth.\n\n**Phase 05** — Rigorous Testing\nSecurity checks, API audit, TS build validation.\n\n**Phase 06** — Deployment & Launch\nVercel (frontend), Render (backend), MongoDB Atlas (database).\n\n**Phase 07** — Dedicated Support\n24/7 maintenance, updates, backups & feature enhancements.\n\nReady to start? Email pinaki.sna@gmail.com!",
    priority: 3,
  },

  // ═══════════════════════════════════════════
  // CONTACT INFORMATION
  // ═══════════════════════════════════════════
  {
    keywords: ['contact', 'reach', 'get in touch', 'email', 'phone', 'call', 'whatsapp', 'message', 'connect', 'hire', 'reach out'],
    response: "📬 **Contact Pinaki Labs:**\n\n📧 Email: **pinaki.sna@gmail.com**\n📞 Phone: **+91 9508725672**\n\nYou can also fill out the contact form on our website with your project details, budget range, and preferred discovery call time. We'll get back to you within 24 hours! 🚀",
    priority: 3,
  },
  {
    keywords: ['address', 'location', 'where', 'office', 'based', 'headquarter'],
    response: "📍 **Our Location:**\nSector 62, Noida\nNew Delhi NCR, India\n\nFor inquiries, reach us at:\n📞 Call / WhatsApp: +91 9508725672\n📧 Email: pinaki.sna@gmail.com",
    priority: 3,
  },

  // ═══════════════════════════════════════════
  // PORTFOLIO / PROJECTS
  // ═══════════════════════════════════════════
  {
    keywords: ['portfolio', 'projects', 'work', 'case study', 'examples', 'previous work', 'past projects', 'show work', 'clients', 'completed'],
    response: "🏗️ **Our Portfolio Highlights:**\n\n📊 **120+ Projects Completed**\n😊 **50+ Happy Clients**\n⏳ **5+ Years Experience**\n✅ **99% Success Rate**\n\nWe've built everything from AI CRM portals and cryptocurrency apps to e-commerce platforms and deep learning models. Check out our portfolio section on the website, or email pinaki.sna@gmail.com to see specific case studies relevant to your industry!",
    priority: 3,
  },

  // ═══════════════════════════════════════════
  // STATS
  // ═══════════════════════════════════════════
  {
    keywords: ['stats', 'statistics', 'numbers', 'achievements', 'track record', 'experience', 'how many projects', 'success rate'],
    response: "📈 **Pinaki Labs by the Numbers:**\n\n🏗️ **120+** Projects Completed\n😊 **50+** Happy Clients\n⏳ **5+** Years of Experience\n✅ **99%** Success Rate\n\nWe don't build minimum viable products — we build digital command consoles that command market authority! 🚀",
    priority: 3,
  },

  // ═══════════════════════════════════════════
  // FAQ TOPICS
  // ═══════════════════════════════════════════
  {
    keywords: ['how long', 'timeline', 'duration', 'time', 'weeks', 'months', 'delivery', 'turnaround', 'deadline', 'when ready'],
    response: "⏱️ **Project Timelines:**\n\n• **Simple landing/portfolio websites**: 2-4 weeks\n• **Complex full-stack applications with database panels**: 6-12 weeks\n• **Enterprise-grade projects with AI/ML**: Custom timeline based on scope\n\nWe hold consultation sessions first to define exact deadlines. Contact pinaki.sna@gmail.com to discuss your project timeline!",
    priority: 3,
  },
  {
    keywords: ['figma', 'design first', 'prototype first', 'design before code'],
    response: "🎨 Yes! We design in Figma before coding. Our designer maps user flows, wireframes, and complete high-fidelity desktop and mobile layouts in Figma first. Only after approval do we move to development. This ensures the final product matches your vision perfectly!",
    priority: 4,
  },
  {
    keywords: ['edit content', 'update content', 'manage content', 'after launch', 'edit website', 'change content'],
    response: "✏️ Absolutely! We deliver a **custom-tailored Admin Dashboard CMS** where you can manage:\n\n• Portfolio projects\n• Blog posts\n• Team profiles\n• FAQs\n• And more!\n\nYou'll have full control over your website content without needing any coding skills.",
    priority: 4,
  },
  {
    keywords: ['file attachment', 'upload', 'attachment', 'file upload'],
    response: "📎 File attachments sent via our contact form are routed through our secure **Multer pipeline** and hosted on **Cloudinary** or served locally from our uploads folder. Everything is secured and organized!",
    priority: 4,
  },

  // ═══════════════════════════════════════════
  // TECHNOLOGY STACK
  // ═══════════════════════════════════════════
  {
    keywords: ['tech stack', 'technology', 'tools', 'framework', 'stack', 'what language', 'programming language', 'react', 'next.js', 'node', 'express', 'mongodb'],
    response: "🛠️ **Our Technology Stack:**\n\n**Frontend:** Next.js 15, React, TypeScript, Framer Motion, GSAP, Three.js, Tailwind CSS\n**Backend:** Node.js, Express.js, REST & GraphQL APIs\n**Database:** MongoDB (Mongoose), PostgreSQL, Redis, Supabase\n**AI/ML:** Python, PyTorch, TensorFlow, PaddleOCR, Ollama, OpenCV\n**Auth:** JWT, OAuth, Custom Role-based Access\n**Deploy:** Vercel, Render, AWS, Docker, GitHub Actions\n**Design:** Figma, Adobe Suite\n**Real-time:** Socket.IO, WebSockets\n\nWe use the most modern and battle-tested technologies!",
    priority: 3,
  },

  // ═══════════════════════════════════════════
  // TESTIMONIALS / REVIEWS
  // ═══════════════════════════════════════════
  {
    keywords: ['testimonial', 'review', 'feedback', 'client say', 'reputation', 'trust', 'recommendation'],
    response: "⭐ **What Our Clients Say:**\n\n💬 **Marcus Thorne** (CEO, Aura Analytics): \"The AI CRM portal has completely streamlined our inbox management. Churn predictions at 92% accuracy!\"\n\n💬 **Sarah Jenkins** (Product Director, Jenkins Retail): \"Next.js landing layouts convert at 18.5%, and the 3D scroll effects blew our board away.\"\n\n💬 **Rajesh Nair** (VP, Nair Logistic Solutions): \"Python bots automated a 4-person job. Deployed on AWS, runs like a clock.\"\n\n💬 **Lara Croft** (Creative Lead, Croft Cryptology): \"Figma designs and UI mockups were breath-taking for our crypto app.\"\n\nAll our clients rate us ⭐⭐⭐⭐⭐!",
    priority: 3,
  },

  // ═══════════════════════════════════════════
  // ABOUT / VALUES
  // ═══════════════════════════════════════════
  {
    keywords: ['about', 'about pinaki', 'values', 'mission', 'vision', 'culture', 'why pinaki', 'why choose', 'different'],
    response: "🏛️ **About Pinaki Labs:**\n\nFounded by three creative engineers who got tired of cookie-cutter software solutions. We bridge the gap between elite high-end visual design and robust full-stack engineering.\n\n**Our Core Values:**\n🎯 **Mission Oriented** — Complex workflows → straightforward growth vectors\n👁️ **Clear Vision** — Client-first full-stack engineering with zero tech debt\n🛡️ **Strict Security** — JWT auth, role checks, database validation\n🤝 **Transparent Culture** — Active communication & post-delivery maintenance\n\n*\"We don't build minimum viable products. We build digital command consoles that command market authority.\"* — Pinaki Team Founders",
    priority: 3,
  },

  // ═══════════════════════════════════════════
  // BLOG
  // ═══════════════════════════════════════════
  {
    keywords: ['blog', 'articles', 'posts', 'content', 'insights', 'resources', 'read'],
    response: "📝 **Pinaki Blog:**\n\nWe regularly publish tech logs, ML insights, and digital design guides on our blog section. Check out our latest articles on the website! You can also subscribe to our newsletter to receive monthly updates directly to your inbox.",
    priority: 3,
  },

  // ═══════════════════════════════════════════
  // NEWSLETTER
  // ═══════════════════════════════════════════
  {
    keywords: ['newsletter', 'subscribe', 'updates', 'mailing list'],
    response: "📬 **Newsletter:**\n\nSubscribe to our newsletter in the footer section to receive monthly tech logs, ML insights, and digital design guides directly to your inbox! Stay updated with the latest from Pinaki Labs.",
    priority: 3,
  },

  // ═══════════════════════════════════════════
  // PAYMENT / BILLING
  // ═══════════════════════════════════════════
  {
    keywords: ['payment', 'pay', 'billing', 'invoice', 'stripe', 'method', 'installment'],
    response: "💳 **Payment Information:**\n\nWe offer flexible payment options. Projects typically follow a milestone-based payment structure. For specific payment arrangements, contact us at pinaki.sna@gmail.com and we'll work out a plan that suits your needs.\n\nFor e-commerce projects, we integrate Stripe for seamless payment processing.",
    priority: 3,
  },

  // ═══════════════════════════════════════════
  // MOBILE APP
  // ═══════════════════════════════════════════
  {
    keywords: ['mobile', 'app', 'ios', 'android', 'react native', 'mobile app', 'phone app'],
    response: "📱 **Mobile App Development:**\n\nYes, we develop mobile applications! Our expertise includes responsive web apps and cross-platform solutions. Our team has experience building cryptocurrency mobile apps and other complex mobile experiences.\n\nFor mobile app inquiries, email pinaki.sna@gmail.com with your requirements!",
    priority: 3,
  },

  // ═══════════════════════════════════════════
  // DISCOVERY CALL / MEETING
  // ═══════════════════════════════════════════
  {
    keywords: ['meeting', 'call', 'consultation', 'discovery', 'schedule', 'book', 'appointment', 'discuss'],
    response: "📅 **Schedule a Discovery Call:**\n\nYou can book a discovery call directly from our Contact section! Choose your preferred date and time:\n\n⏰ Available slots:\n• 10:00 AM EST\n• 01:30 PM EST\n• 04:00 PM EST\n\nOr email us directly at pinaki.sna@gmail.com and we'll arrange a call at your convenience!",
    priority: 3,
  },

  // ═══════════════════════════════════════════
  // SECURITY
  // ═══════════════════════════════════════════
  {
    keywords: ['security', 'secure', 'safe', 'privacy', 'data protection', 'ssl', 'encryption', 'jwt', 'authentication'],
    response: "🔐 **Security Measures:**\n\nEvery project goes through rigorous security processes:\n\n✅ JWT Authentication Mapping\n✅ Secure Role-based Access Checks\n✅ Database Validation\n✅ SSL Certificate Configuration\n✅ Auth Middleware Security Checks\n✅ API Query Speed Audits\n✅ TypeScript Build Checks\n\nYour data and your users' data are always protected with us.",
    priority: 3,
  },

  // ═══════════════════════════════════════════
  // CUSTOM/SPECIFIC REQUESTS
  // ═══════════════════════════════════════════
  {
    keywords: ['custom', 'customize', 'bespoke', 'tailor', 'specific', 'unique', 'special'],
    response: "✨ **Custom Solutions:**\n\nAbsolutely! Every project we build is custom-tailored to your specific needs. We never use templates or cookie-cutter solutions. From custom LLM integrations to bespoke Three.js 3D scenes — if you can dream it, we can build it.\n\nTell us about your vision at pinaki.sna@gmail.com!",
    priority: 3,
  },

  // ═══════════════════════════════════════════
  // HELP / FALLBACK
  // ═══════════════════════════════════════════
  {
    keywords: ['help', 'assist', 'guide', 'faq', 'question', 'doubt'],
    response: "💡 **I can help you with:**\n\n• 🌐 Our Services (16 different offerings)\n• 👨‍💻 Team Information (Somesh, Nishant, Aman)\n• ⚙️ Our Development Process (7 phases)\n• 📊 Portfolio & Stats (120+ projects)\n• 🛠️ Technology Stack\n• 📬 Contact Details\n• ⭐ Client Testimonials\n• ⏱️ Project Timelines\n• 🔐 Security Measures\n• 💬 Custom Quote Discussion\n\nJust type your question and I'll provide detailed answers!",
    priority: 2,
  },
];

// ── Smart Response Engine ──

function findBestResponse(input: string): string {
  const lowerInput = input.toLowerCase().trim();

  // Score each knowledge entry
  let bestMatch: { response: string; score: number } | null = null;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;

    for (const keyword of entry.keywords) {
      if (lowerInput.includes(keyword.toLowerCase())) {
        // Longer keyword matches are more specific → higher score
        score += keyword.length * entry.priority;
      }
    }

    // Exact match bonus
    for (const keyword of entry.keywords) {
      if (lowerInput === keyword.toLowerCase()) {
        score += 100;
      }
    }

    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { response: entry.response, score };
    }
  }

  if (bestMatch && bestMatch.score > 0) {
    return bestMatch.response;
  }

  // Fallback response
  return "I appreciate your question! 🤔 While I might not have the exact answer to that, I can help you with information about our **services**, **team**, **process**, **portfolio**, and **contact details**.\n\nFor specific inquiries or to discuss your project, reach us directly:\n📞 **Call / WhatsApp:** +91 9508725672\n📧 **Email:** pinaki.sna@gmail.com\n\nWe respond within a few hours! Try asking me about:\n• What services do you offer?\n• Tell me about the team\n• How does your process work?\n• How do I contact you?";
}

// ── Format message text with basic markdown ──

function formatMessage(text: string): React.ReactNode {
  // Split by lines and process bold text and emojis
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Process bold markers **text**
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const formatted = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} className="font-semibold text-ink">{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    return (
      <React.Fragment key={i}>
        {formatted}
        {i < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

// ═════════════════════════════════════════════════
//  VOICE TAB COMPONENT
// ═════════════════════════════════════════════════

function VoiceTab() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]')) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    script.type = 'text/javascript';
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-5 gap-4">
      {/* Decorative audio wave visualization */}
      <div className="flex items-end gap-[3px] h-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="w-[3px] rounded-full bg-accent"
            animate={{
              height: [
                `${6 + Math.random() * 14}px`,
                `${18 + Math.random() * 22}px`,
                `${6 + Math.random() * 14}px`,
              ],
            }}
            transition={{
              duration: 0.8 + Math.random() * 0.6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.04,
            }}
          />
        ))}
      </div>

      {/* Info Text */}
      <div className="max-w-[280px] space-y-2 text-center">
        <p className="font-poppins text-xs leading-relaxed text-ink-muted">
          Speak with <span className="font-semibold text-accent">Pinaki Voice AI</span> to learn
          about our services, team, and how to get started.
        </p>
        <p className="font-mono text-[10px] uppercase tracking-wide text-ink-subtle">
          Click the microphone below to start
        </p>
      </div>

      {/* ElevenLabs Widget */}
      <div className="w-full flex justify-center items-center min-h-[80px]">
        {scriptLoaded ? (
          <div
            dangerouslySetInnerHTML={{
              __html: `<elevenlabs-convai agent-id="${ELEVENLABS_AGENT_ID}"></elevenlabs-convai>`,
            }}
          />
        ) : (
          <div className="flex items-center gap-2 font-mono text-xs text-ink-subtle">
            <motion.div
              className="h-4 w-4 rounded-full border-2 border-line-strong border-t-accent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            Loading voice agent...
          </div>
        )}
      </div>

      {/* Security Badge */}
      <div className="flex items-center gap-2 rounded-lg border border-line bg-surface-inset px-3 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-positive" />
        <span className="font-mono text-[9px] uppercase tracking-wider text-ink-subtle">
          Powered by ElevenLabs • Encrypted
        </span>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════
//  MAIN UNIFIED COMPONENT
// ═════════════════════════════════════════════════

export default function PinakiChatbot() {
  const [chatOpen, setChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: "Hey! 👋 I'm **Pinaki**, your AI assistant. I know everything about our services, team, portfolio, and how to connect with us. Ask me anything!",
      timestamp: new Date(),
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when chat opens or tab switches to chat
  useEffect(() => {
    if (chatOpen && activeTab === 'chat') {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [chatOpen, activeTab]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = inputVal.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg, timestamp: new Date() }]);
    setInputVal('');
    setIsTyping(true);

    // Simulate typing delay for realistic feel
    const delay = Math.min(800 + userMsg.length * 15, 2000);
    setTimeout(() => {
      const response = findBestResponse(userMsg);
      setMessages((prev) => [...prev, { sender: 'bot', text: response, timestamp: new Date() }]);
      setIsTyping(false);
    }, delay);
  };

  const suggestions = [
    'Services',
    'Team',
    'Contact',
    'Portfolio',
  ];

  const handleSuggestion = (text: string) => {
    setMessages((prev) => [...prev, { sender: 'user', text, timestamp: new Date() }]);
    setIsTyping(true);
    setTimeout(() => {
      const response = findBestResponse(text);
      setMessages((prev) => [...prev, { sender: 'bot', text: response, timestamp: new Date() }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* ─── Unified Panel ─── */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="flex h-[540px] w-[360px] flex-col overflow-hidden rounded-xl border border-line-strong bg-surface sm:w-[400px]"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-line bg-surface-hover px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-ink">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <span className="flex items-center gap-1.5 font-space text-sm font-bold tracking-wide text-ink">
                    Pinaki AI
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-positive">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-positive" />
                    Online • {activeTab === 'chat' ? 'Text Mode' : 'Voice Mode'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                aria-label="Close assistant"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-line bg-surface-inset text-ink-subtle transition-colors hover:border-line-strong hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ─── Tab Switcher ─── */}
            <div role="tablist" aria-label="Assistant mode" className="flex shrink-0 border-b border-line bg-surface-inset">
              {([
                { id: 'chat', label: 'Chat', Icon: MessageCircle },
                { id: 'voice', label: 'Voice', Icon: Mic },
              ] as const).map(({ id, label, Icon }) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={activeTab === id}
                  onClick={() => setActiveTab(id)}
                  className={`relative flex flex-1 cursor-pointer items-center justify-center gap-2 py-3 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                    activeTab === id ? 'text-accent' : 'text-ink-subtle hover:text-ink-muted'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                  {activeTab === id && (
                    <motion.span
                      layoutId="activeTabIndicator"
                      className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-accent"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* ─── Tab Content ─── */}
            <AnimatePresence mode="wait">
              {activeTab === 'chat' ? (
                <motion.div
                  key="chat-tab"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-hide">
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {/* Avatar */}
                        <div
                          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
                            msg.sender === 'bot'
                              ? 'border-accent-line bg-accent-soft text-accent'
                              : 'border-line bg-surface-hover text-ink-muted'
                          }`}
                        >
                          {msg.sender === 'bot' ? (
                            <Bot className="h-3.5 w-3.5" />
                          ) : (
                            <User className="h-3.5 w-3.5" />
                          )}
                        </div>

                        {/* Bubble */}
                        <div
                          className={`max-w-[80%] rounded-xl px-3.5 py-2.5 font-poppins text-[11.5px] leading-[1.65] ${
                            msg.sender === 'user'
                              ? 'rounded-tr-sm bg-accent text-accent-ink'
                              : 'rounded-tl-sm border border-line bg-surface-inset text-ink-muted'
                          }`}
                        >
                          {formatMessage(msg.text)}
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-2 items-center"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-accent-line bg-accent-soft text-accent">
                          <Bot className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex items-center gap-1 rounded-xl rounded-tl-sm border border-line bg-surface-inset px-4 py-3">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent" style={{ animationDelay: '0ms' }} />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent" style={{ animationDelay: '150ms' }} />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent" style={{ animationDelay: '300ms' }} />
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Suggestions (only when few messages) */}
                  {messages.length <= 2 && (
                    <div className="px-4 pb-2 flex gap-2 flex-wrap">
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSuggestion(s)}
                          className="cursor-pointer rounded-lg border border-accent-line bg-accent-soft px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-accent transition-colors hover:bg-accent hover:text-accent-ink"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Input */}
                  <form onSubmit={handleSend} className="flex shrink-0 gap-2 border-t border-line bg-surface-hover px-4 py-3">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Ask Pinaki anything..."
                      aria-label="Message"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      className="flex-1 rounded-lg border border-line bg-surface-inset px-4 py-2.5 font-poppins text-xs text-ink transition-colors placeholder:text-ink-subtle focus:border-accent"
                    />
                    <button
                      type="submit"
                      disabled={!inputVal.trim()}
                      aria-label="Send message"
                      className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-accent text-accent-ink transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="voice-tab"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <VoiceTab />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Toggle Button ─── */}
      <motion.button
        onClick={() => setChatOpen(!chatOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={chatOpen ? 'Close Pinaki AI Hub' : 'Open Pinaki AI Hub'}
        aria-expanded={chatOpen}
        className="group relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-accent text-accent-ink transition-colors hover:bg-accent-hover"
      >
        <AnimatePresence mode="wait">
          {chatOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Sparkles className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse notification dot */}
        {!chatOpen && (
          <span
            aria-hidden
            className="absolute -right-0.5 -top-0.5 h-4 w-4 animate-pulse rounded-full border-2 border-canvas bg-positive"
          />
        )}

        {/* Hover tooltip */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-full right-0 mb-2 translate-y-1 whitespace-nowrap rounded-lg border border-line bg-surface px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-muted opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
        >
          Pinaki AI Hub
        </span>
      </motion.button>
    </div>
  );
}
