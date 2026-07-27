'use client';

import React from 'react';
import { Phone, MessageSquare, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const contactChannels = [
  {
    icon: Phone,
    label: 'Call Us',
    description: 'Speak directly with our team',
    links: [
      { href: 'tel:+919508725672', display: '+91 9508725672' },
      { href: 'tel:+918210686793', display: '+91 8210686793' },
      { href: 'tel:+917079673468', display: '+91 7079673468' },
    ],
    color: '#06B6D4',
    bg: 'bg-[#06B6D4]/10',
  },
  {
    icon: MessageSquare,
    label: 'WhatsApp Us',
    description: 'Chat with us on WhatsApp for quick replies',
    links: [
      { href: 'https://wa.me/919508725672', display: '+91 9508725672' },
      { href: 'https://wa.me/918210686793', display: '+91 8210686793' },
      { href: 'https://wa.me/917079673468', display: '+91 7079673468' },
    ],
    color: '#22C55E',
    bg: 'bg-green-500/10',
  },
  {
    icon: Mail,
    label: 'Email Us',
    description: 'Send us your project details anytime',
    links: [
      { href: 'mailto:pinaki.sna@gmail.com', display: 'pinaki.sna@gmail.com' },
    ],
    color: '#8B5CF6',
    bg: 'bg-[#8B5CF6]/10',
  },
];

export default function ContactCTA() {
  return (
    <section id="pricing" className="py-24 px-6 bg-[#0B1120]/30 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#8B5CF6]/6 blur-[130px] pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col mb-16 text-center items-center">
          <span className="text-xs font-mono tracking-widest text-[#8B5CF6] uppercase mb-2">// GET IN TOUCH</span>
          <h2 className="text-3xl md:text-5xl font-bold font-space text-white tracking-tight mb-4">
            Let&apos;s Discuss Your Project
          </h2>
          <p className="text-[#EDEDED]/55 text-sm font-poppins max-w-xl leading-relaxed">
            Every project is unique. Reach out to us directly — we&apos;ll understand your requirements and craft a tailored solution just for you.
          </p>
        </div>

        {/* Contact channel cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {contactChannels.map((channel, idx) => (
            <motion.div
              key={channel.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="flex flex-col gap-5 p-8 rounded-2xl border border-white/5 bg-[#111720]/50 hover:border-white/10 transition-all duration-300"
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl ${channel.bg} flex items-center justify-center`}
                style={{ color: channel.color }}
              >
                <channel.icon className="w-5 h-5" />
              </div>

              {/* Title */}
              <div>
                <h3 className="font-space text-lg font-bold text-white uppercase tracking-wider mb-1">
                  {channel.label}
                </h3>
                <p className="text-[11px] font-poppins text-[#EDEDED]/50 leading-relaxed">
                  {channel.description}
                </p>
              </div>

              {/* Links */}
              <div className="flex flex-col gap-2 mt-auto">
                {channel.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="flex items-center justify-between group"
                  >
                    <span
                      className="text-xs font-space font-semibold transition-colors duration-200"
                      style={{ color: channel.color }}
                    >
                      {link.display}
                    </span>
                    <ArrowRight
                      className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ color: channel.color }}
                    />
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-center p-8 rounded-2xl border border-[#8B5CF6]/20 bg-[#8B5CF6]/5 backdrop-blur-sm"
        >
          <p className="font-space text-white font-bold text-lg mb-2">
            No Fixed Price Tags — Because Your Vision Is Custom
          </p>
          <p className="text-[#EDEDED]/55 text-xs font-poppins max-w-lg mx-auto leading-relaxed">
            We believe in transparent, honest conversations. Connect with us via call, WhatsApp, or email and we will provide a personalised quote based on your exact needs — no hidden fees, no surprises.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
