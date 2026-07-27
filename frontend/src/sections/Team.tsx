'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Award } from 'lucide-react';
import Image from 'next/image';
import { Card, Section, SectionHeading } from '@/components/ui/primitives';
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

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

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
      } catch {
        console.warn('Could not connect to team API. Using local fallbacks.');
      }
    };
    fetchTeam();
  }, []);

  return (
    <Section id="team" tone="canvas">
      <SectionHeading eyebrow="The Directors" title="Meet The Innovators" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {team.map((member, idx) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            className="group h-full"
          >
            <Card interactive className="flex h-full flex-col justify-between">
              <div>
                <div className="relative mb-6 h-[320px] w-full overflow-hidden rounded-lg border border-line">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="mb-4">
                  <h3 className="font-space text-xl font-bold text-ink">{member.name}</h3>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                    {member.role}
                  </p>
                </div>

                <div className="mb-6 flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-wider text-ink-subtle">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" />
                    {member.projectsCount} Projects
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5" />
                    {member.experience}
                  </span>
                </div>

                <p className="mb-6 font-poppins text-xs leading-relaxed text-ink-muted">
                  {member.bio}
                </p>

                <div className="mb-6 flex flex-col gap-4">
                  {member.skills.map((skill) => (
                    <div key={skill.name} className="flex flex-col gap-1.5">
                      <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider">
                        <span className="text-ink-muted">{skill.name}</span>
                        <span className="text-accent">{skill.level}%</span>
                      </div>
                      <div className="h-[3px] w-full overflow-hidden rounded-full bg-line">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                          className="h-full bg-accent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 border-t border-line pt-4">
                {member.socialLinks?.github && (
                  <a
                    href={member.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} on GitHub`}
                    className="text-ink-subtle transition-colors hover:text-accent"
                  >
                    <GithubIcon />
                  </a>
                )}
                {member.socialLinks?.linkedin && (
                  <a
                    href={member.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} on LinkedIn`}
                    className="text-ink-subtle transition-colors hover:text-accent"
                  >
                    <LinkedinIcon />
                  </a>
                )}
                {member.socialLinks?.twitter && (
                  <a
                    href={member.socialLinks.twitter}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} on X`}
                    className="text-ink-subtle transition-colors hover:text-accent"
                  >
                    <TwitterIcon />
                  </a>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
