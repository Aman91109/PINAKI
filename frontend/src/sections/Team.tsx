'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Briefcase, Award } from 'lucide-react';
import Image from 'next/image';
import TiltCard from '../components/ui/TiltCard';
import { API_BASE_URL } from '@/config';

const fallbackTeam = [
  {
    name: 'Somesh Kumar Mishra',
    role: 'Full-Stack & GenAI Architect',
    bio: "National SIH'24 Winner. President of the MIT Coding Club. Specializes in MERN applications, Socket.IO real-time channels, Redis caching, and custom multi-role validation blocks.",
    skills: [
      { name: 'Next.js / React / TS', level: 98 },
      { name: 'Node.js & Socket.IO', level: 95 },
      { name: 'Docker & Cloud Deploy', level: 90 },
    ],
    experience: '4+ Years',
    projectsCount: 28,
    image: '/somesh.jpg',
    socialLinks: { github: 'https://github.com/Somesh-Mishra-9', linkedin: 'https://www.linkedin.com/in/somesh-mishra-ba2358219/', twitter: 'https://twitter.com' },
  },
  {
    name: 'Nishant Kumar',
    role: 'Backend & ML Systems Engineer',
    bio: 'TCS NQT Top 5% Ranker. Vice President of the MIT Coding Club. Expert in Next.js backend routing, REST endpoints, database structures, and PaddleOCR/Ollama NLP pipelines.',
    skills: [
      { name: 'TypeScript & Node API', level: 97 },
      { name: 'Python & NLP Models', level: 95 },
      { name: 'PostgreSQL & MongoDB', level: 93 },
    ],
    experience: '4+ Years',
    projectsCount: 35,
    image: '/nishant.jpg',
    socialLinks: { github: 'https://github.com/nishant946', linkedin: 'https://www.linkedin.com/in/nishant-kumar-a5b9a3258/', twitter: 'https://twitter.com' },
  },
  {
    name: 'Aman Kumar',
    role: 'Researcher & Data Scientist',
    bio: 'Event Coordinator at DTC Foss Club. Expert in Deep Learning (CNNs), Generative AI models, image preprocessing using OpenCV, and Supabase analytics logging pipelines.',
    skills: [
      { name: 'Deep Learning & CNN', level: 96 },
      { name: 'Python & Data Analytics', level: 94 },
      { name: 'Cloud & Database Mappings', level: 91 },
    ],
    experience: '3+ Years',
    projectsCount: 18,
    image: '/aman-kumar.jpg',
    socialLinks: { github: 'https://github.com/Aman91109', linkedin: 'https://www.linkedin.com/in/aman-kumar-735905321', twitter: 'https://twitter.com' },
  },
];

export default function Team() {
  const [team, setTeam] = useState(fallbackTeam);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/public/team`);
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setTeam(data.data);
        }
      } catch (err) {
        console.warn('Could not connect to team API. Using local fallbacks.');
      }
    };
    fetchTeam();
  }, []);

  return (
    <section id="team" className="py-24 px-6 bg-[#050816] relative overflow-hidden">
      {/* Background spotlights */}
      <div className="absolute top-[30%] left-[10%] w-[350px] h-[350px] rounded-full bg-[#3B82F6]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col mb-16">
          <span className="text-xs font-mono tracking-widest text-[#06B6D4] uppercase mb-2">// THE DIRECTORS</span>
          <h2 className="text-3xl md:text-5xl font-bold font-space text-white tracking-tight">
            Meet The Innovators
          </h2>
        </div>

        {/* Members Grid (3 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
            >
              <TiltCard className="p-6 h-full flex flex-col justify-between border border-white/5 bg-[#111720]/45">
                <div>
                  {/* Photo Container */}
                  <div className="relative w-full h-[320px] rounded-xl overflow-hidden mb-6 group-image border border-white/5">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-w-720px) 100vw, 30vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Solid dark overlay on image bottom */}
                    <div className="absolute inset-0 bg-[#050816]/40" />

                    {/* Hover detail slide-up */}
                    <div className="absolute bottom-4 left-4 right-4 z-20 flex gap-2 justify-between items-center bg-[#0B1120]/80 backdrop-blur-md border border-white/10 p-3 rounded-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <div className="flex items-center gap-1 text-[10px] font-mono tracking-widest uppercase text-[#06B6D4]">
                        <Briefcase className="w-3.5 h-3.5" />
                        {member.projectsCount} Projects
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-mono tracking-widest uppercase text-[#8B5CF6]">
                        <Award className="w-3.5 h-3.5" />
                        {member.experience}
                      </div>
                    </div>
                  </div>

                  {/* Name and Role */}
                  <div className="mb-4">
                    <h3 className="font-space text-xl font-bold text-white flex items-center gap-1.5">
                      {member.name}
                      <Sparkles className="w-4 h-4 text-[#06B6D4] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="font-mono text-[10px] tracking-widest text-[#06B6D4] uppercase mt-1">
                      {member.role}
                    </p>
                  </div>

                  {/* Biography */}
                  <p className="font-poppins text-xs text-[#EDEDED]/50 leading-relaxed mb-6">
                    {member.bio}
                  </p>

                  {/* Skill indicators */}
                  <div className="flex flex-col gap-4 mb-6">
                    {member.skills.map((skill) => (
                      <div key={skill.name} className="flex flex-col gap-1">
                        <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider text-[#EDEDED]/70">
                          <span>{skill.name}</span>
                          <span className="text-[#8B5CF6]">{skill.level}%</span>
                        </div>
                        <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                            className="h-full bg-[#8B5CF6]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Network Nodes */}
                <div className="flex gap-3 pt-4 border-t border-white/5">
                  {member.socialLinks?.github && (
                    <a href={member.socialLinks.github} className="text-[#EDEDED]/40 hover:text-white transition-colors">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                        <path d="M9 18c-4.51 2-5-2-7-2" />
                      </svg>
                    </a>
                  )}
                  {member.socialLinks?.linkedin && (
                    <a href={member.socialLinks.linkedin} className="text-[#EDEDED]/40 hover:text-white transition-colors">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                  )}
                  {member.socialLinks?.twitter && (
                    <a href={member.socialLinks.twitter} className="text-[#EDEDED]/40 hover:text-white transition-colors">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  )}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
