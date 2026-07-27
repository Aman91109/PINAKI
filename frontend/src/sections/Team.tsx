'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Badge, Section, SectionHeading } from '@/components/ui/primitives';
import { API_BASE_URL } from '@/config';

interface Member {
  name: string;
  role: string;
  bio: string;
  focus: string[];
  experience: string;
  projectsCount: number;
  image: string;
  socialLinks: { github?: string; linkedin?: string; twitter?: string };
}

/**
 * Percentage skill bars were removed: self-assigned numbers like "Next.js 98%"
 * read as junior and mean nothing to a buyer. A plain list of what each person
 * actually works on is more useful and more credible.
 */
const fallbackTeam: Member[] = [
  {
    name: 'Somesh Kumar Mishra',
    role: 'Full-stack & GenAI',
    bio: "National SIH'24 winner and President of the MIT Coding Club. Builds the application layer — real-time features, caching and multi-role access control.",
    focus: ['Next.js', 'React', 'Socket.IO', 'Redis', 'Docker'],
    experience: '4+ years',
    projectsCount: 28,
    image: '/somesh.jpg',
    socialLinks: {
      github: 'https://github.com/Somesh-Mishra-9',
      linkedin: 'https://www.linkedin.com/in/somesh-mishra-ba2358219/',
    },
  },
  {
    name: 'Nishant Kumar',
    role: 'Backend & ML systems',
    bio: 'TCS NQT top 5% ranker and Vice President of the MIT Coding Club. Owns the data layer, API design and the NLP pipelines that sit behind them.',
    focus: ['Node', 'TypeScript', 'Python', 'PostgreSQL', 'MongoDB'],
    experience: '4+ years',
    projectsCount: 35,
    image: '/nishant.jpg',
    socialLinks: {
      github: 'https://github.com/nishant946',
      linkedin: 'https://www.linkedin.com/in/nishant-kumar-a5b9a3258/',
    },
  },
  {
    name: 'Aman Kumar',
    role: 'Research & data science',
    bio: 'Event coordinator at the DTC FOSS Club. Handles model work — computer vision, generative models and the analytics that prove they are working.',
    focus: ['Deep learning', 'OpenCV', 'Python', 'Analytics', 'Supabase'],
    experience: '3+ years',
    projectsCount: 18,
    image: '/aman-kumar.jpg',
    socialLinks: {
      github: 'https://github.com/Aman91109',
      linkedin: 'https://www.linkedin.com/in/aman-kumar-735905321',
    },
  },
];

const principles = [
  {
    title: 'You talk to the builders',
    body: 'No account managers relaying messages. The person answering your question is the person writing the code.',
  },
  {
    title: 'Scope is fixed before we start',
    body: 'You get a written scope and a fixed quote up front. If the work grows, we re-quote rather than quietly billing more.',
  },
  {
    title: 'Small book, on purpose',
    body: 'We take a limited number of projects at a time so nothing sits in a queue waiting for attention.',
  },
  {
    title: 'You own everything',
    body: 'Source code, design files and infrastructure are yours on final payment. No lock-in, no hostage situations.',
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

export default function Team() {
  const [team, setTeam] = useState<Member[]>(fallbackTeam);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/public/team`);
        const data = await res.json();
        if (data.success && data.data?.length) setTeam(data.data);
      } catch {
        console.warn('Team API unreachable. Using local defaults.');
      }
    };
    fetchTeam();
  }, []);

  return (
    <Section id="team" tone="canvas">
      <SectionHeading
        index="04"
        eyebrow="The studio"
        title="Three engineers, not an agency."
        description="Pinaki is a small freelance studio. We started it because good engineering was either locked behind agency retainers or delivered slowly by shops that treated the front end as an afterthought. We do both halves properly, and there is no layer between you and us."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {team.map((member, idx) => (
          <motion.article
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors duration-200 hover:border-line-strong"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden border-b border-line">
              <Image
                src={member.image}
                alt={member.name}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover grayscale transition-all duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
              />
            </div>

            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                {member.name}
              </h3>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                {member.role}
              </p>

              <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">{member.bio}</p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {(member.focus || []).map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-5 mt-6">
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-subtle">
                  {member.experience} · {member.projectsCount} projects
                </span>
                <div className="flex gap-3">
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
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* How we operate */}
      <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {principles.map((p) => (
          <div key={p.title} className="bg-surface p-6">
            <h3 className="font-display text-sm font-bold tracking-tight text-ink">{p.title}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{p.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
