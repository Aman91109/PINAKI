'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MessageSquare, Calendar as CalendarIcon, CheckCircle2, AlertCircle, Clock, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { API_BASE_URL } from '@/config';

const projectTypes = [
  'Web Development',
  'AI/ML Solutions',
  'UI/UX Design',
  'Automation',
  'Mobile Apps',
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: 'Web Development',
    message: '',
  });

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setFeedbackMsg('Please complete all required fields (Name, Email, Message).');
      return;
    }

    setStatus('submitting');
    try {
      const bodyData = new FormData();
      bodyData.append('name', formData.name);
      bodyData.append('email', formData.email);
      bodyData.append('phone', formData.phone);
      bodyData.append('company', formData.company);
      bodyData.append('projectType', formData.projectType);

      let finalMessage = formData.message;
      if (selectedDate && selectedTime) {
        finalMessage += `\n\n[DISCOVERY CALL REQUESTED: ${selectedDate} at ${selectedTime}]`;
      }
      bodyData.append('message', finalMessage);

      const res = await fetch(`${API_BASE_URL}/api/public/lead`, {
        method: 'POST',
        body: bodyData,
      });

      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setFeedbackMsg(data.message || 'Inquiry submitted successfully!');

        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
        });

        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          projectType: 'Web Development',
          message: '',
        });
        setSelectedDate('');
        setSelectedTime('');
      } else {
        setStatus('error');
        setFeedbackMsg(data.error || 'Submission failed.');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setFeedbackMsg('Could not connect to the API server. Form offline.');
    }
  };

  return (
    <section id="contact" className="py-24 px-6 bg-[#0B1120]/30 relative overflow-hidden">
      {/* Background spotlights */}
      <div className="absolute top-[30%] left-[5%] w-[450px] h-[450px] rounded-full bg-[#8B5CF6]/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[5%] w-[450px] h-[450px] rounded-full bg-[#06B6D4]/5 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section title */}
        <div className="flex flex-col mb-16 text-center items-center">
          <span className="text-xs font-mono tracking-widest text-[#06B6D4] uppercase mb-2">// HIRE US</span>
          <h2 className="text-3xl md:text-5xl font-bold font-space text-white tracking-tight">
            Initiate Project Request
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Coordinates & Calendar scheduler */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <h3 className="font-space text-xl font-bold text-white">
              Connect Directly with the Directors
            </h3>
            
            {/* CTA channel nodes */}
            <div className="flex flex-col gap-4">
              <a
                href="mailto:pinaki.sna@gmail.com"
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-[#111720]/45 hover:border-[#8B5CF6]/40 hover:bg-[#8B5CF6]/5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-[#EDEDED]/40 uppercase tracking-widest">Send Email</span>
                  <span className="text-xs font-space text-white">pinaki.sna@gmail.com</span>
                </div>
              </a>

              {/* WhatsApp — three numbers */}
              <div className="flex flex-col gap-2 p-4 rounded-xl border border-white/5 bg-[#111720]/45 hover:border-green-500/40 hover:bg-green-500/5 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="block text-[10px] font-mono text-[#EDEDED]/40 uppercase tracking-widest">WhatsApp Direct</span>
                </div>
                <div className="flex flex-col gap-1 pl-14">
                  <a href="https://wa.me/919508725672" target="_blank" rel="noreferrer" className="text-xs font-space text-white hover:text-green-400 transition-colors">+91 9508725672</a>
                  <a href="https://wa.me/918210686793" target="_blank" rel="noreferrer" className="text-xs font-space text-white hover:text-green-400 transition-colors">+91 8210686793</a>
                  <a href="https://wa.me/917079673468" target="_blank" rel="noreferrer" className="text-xs font-space text-white hover:text-green-400 transition-colors">+91 7079673468</a>
                </div>
              </div>

              {/* Direct Call — three numbers */}
              <div className="flex flex-col gap-2 p-4 rounded-xl border border-white/5 bg-[#111720]/45 hover:border-[#06B6D4]/40 hover:bg-[#06B6D4]/5 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#06B6D4]/10 flex items-center justify-center text-[#06B6D4] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="block text-[10px] font-mono text-[#EDEDED]/40 uppercase tracking-widest">Direct Call</span>
                </div>
                <div className="flex flex-col gap-1 pl-14">
                  <a href="tel:+919508725672" className="text-xs font-space text-white hover:text-[#06B6D4] transition-colors">+91 9508725672</a>
                  <a href="tel:+918210686793" className="text-xs font-space text-white hover:text-[#06B6D4] transition-colors">+91 8210686793</a>
                  <a href="tel:+917079673468" className="text-xs font-space text-white hover:text-[#06B6D4] transition-colors">+91 7079673468</a>
                </div>
              </div>
            </div>

            {/* Calendar Booking Simulation */}
            <div className="rounded-2xl glass-card p-6 border border-white/5 bg-[#111720]/45 flex flex-col gap-4">
              <h4 className="font-space text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#8B5CF6]" />
                Schedule Discovery Call
              </h4>
              <p className="font-poppins text-xs text-[#EDEDED]/50 leading-relaxed">
                Choose a preferred date and time block. We will confirm the call on WhatsApp or email.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] text-[#EDEDED]/40 uppercase">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-[#050816] border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] text-[#EDEDED]/40 uppercase">Time Block</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full bg-[#050816] border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
                  >
                    <option value="">Select Time</option>
                    <option value="10:00 AM - 10:30 AM IST">10:00 AM IST</option>
                    <option value="01:30 PM - 02:00 PM IST">01:30 PM IST</option>
                    <option value="04:00 PM - 04:30 PM IST">04:00 PM IST</option>
                    <option value="07:00 PM - 07:30 PM IST">07:00 PM IST</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Office Location */}
            <div className="rounded-2xl glass-card p-6 border border-white/5 bg-[#111720]/45 flex flex-col gap-3 relative h-[180px] justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#06B6D4]" />
                <span className="font-space text-xs font-semibold text-white uppercase tracking-wider">Office Location</span>
              </div>
              <div className="absolute inset-x-0 bottom-4 h-[100px] flex items-center justify-center opacity-30 select-none">
                <svg className="w-[85%] h-full text-[#06B6D4]" fill="none" viewBox="0 0 200 100">
                  <path d="M20,50 Q60,20 100,50 T180,50" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                  <path d="M20,50 Q60,80 100,50 T180,50" stroke="currentColor" strokeWidth="1" />
                  <circle cx="20" cy="50" r="4" fill="#8B5CF6" />
                  <circle cx="100" cy="50" r="5" fill="#06B6D4" className="animate-pulse" />
                  <circle cx="180" cy="50" r="4" fill="#3B82F6" />
                </svg>
              </div>
              <span className="font-mono text-[9px] text-right text-[#06B6D4] mt-auto z-10 uppercase tracking-widest">
                SECTOR 62, NOIDA — NEW DELHI NCR
              </span>
            </div>

          </div>

          {/* Right Column: Dynamic Lead submission Form */}
          <div className="lg:col-span-7 rounded-2xl glass-card p-8 border border-white/5 bg-[#111720]/45">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] text-[#EDEDED]/55 uppercase tracking-wider">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    className="bg-[#050816] border border-white/10 rounded-xl py-3.5 px-4 text-xs text-white focus:outline-none focus:border-[#06B6D4] transition-colors"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] text-[#EDEDED]/55 uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. rahul@company.com"
                    className="bg-[#050816] border border-white/10 rounded-xl py-3.5 px-4 text-xs text-white focus:outline-none focus:border-[#06B6D4] transition-colors"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] text-[#EDEDED]/55 uppercase tracking-wider">Phone (Optional)</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +91 9876543210"
                    className="bg-[#050816] border border-white/10 rounded-xl py-3.5 px-4 text-xs text-white focus:outline-none focus:border-[#06B6D4] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] text-[#EDEDED]/55 uppercase tracking-wider">Company Name</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="e.g. Acme Corp"
                    className="bg-[#050816] border border-white/10 rounded-xl py-3.5 px-4 text-xs text-white focus:outline-none focus:border-[#06B6D4] transition-colors"
                  />
                </div>
              </div>

              {/* Project Type Toggle */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[9px] text-[#EDEDED]/55 uppercase tracking-wider">Scope of Work</label>
                  <div className="flex flex-wrap gap-2">
                    {projectTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, projectType: type }))}
                        className={`px-4 py-2 rounded-lg font-space text-[10px] uppercase tracking-wider border cursor-pointer transition-colors ${
                          formData.projectType === type
                            ? 'bg-[#06B6D4]/15 border-[#06B6D4] text-[#06B6D4]'
                            : 'bg-[#050816] border-white/5 text-[#EDEDED]/60 hover:text-white hover:border-white/20'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] text-[#EDEDED]/55 uppercase tracking-wider">Detailed Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Describe your project idea, requirements, or anything you'd like to discuss..."
                  className="bg-[#050816] border border-white/10 rounded-xl py-3.5 px-4 text-xs text-white focus:outline-none focus:border-[#06B6D4] transition-colors resize-none"
                  required
                />
              </div>

              {/* Pricing note */}
              <div className="p-4 rounded-xl border border-[#8B5CF6]/20 bg-[#8B5CF6]/5 text-[10px] font-mono text-[#EDEDED]/50 tracking-wide leading-relaxed">
                💬 <span className="text-[#8B5CF6]">No pricing tags here!</span> — After you submit, our team will reach out via WhatsApp or email to understand your scope and share a custom quote personally.
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="neon-button w-full py-4 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-space text-xs uppercase tracking-widest font-bold hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {status === 'submitting' ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin text-[#06B6D4]" />
                    SUBMITTING PROPOSAL...
                  </>
                ) : (
                  'LAUNCH REQUEST'
                )}
              </button>

              {/* Form Feedback banners */}
              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-3 p-4 rounded-xl border border-green-500/20 bg-green-500/5 text-xs text-green-400 font-poppins"
                  >
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{feedbackMsg}</span>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-400 font-poppins"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{feedbackMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
