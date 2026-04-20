'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Brain,
  BarChart3,
  Upload,
  Calendar,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Zap,
  Shield,
  FileText,
} from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Course Management',
    description: 'Organize courses, assignments, and materials in one place with autosave notes.',
  },
  {
    icon: Brain,
    title: 'AI Study Tutor',
    description: 'Context-aware AI chat powered by Gemini — ask about any course or assignment.',
  },
  {
    icon: BarChart3,
    title: 'Visual Analytics',
    description: 'Track study hours, completion rates, and progress with interactive charts.',
  },
  {
    icon: Upload,
    title: 'Secure Uploads',
    description: 'Upload and manage course materials with Supabase Storage and AWS S3.',
  },
  {
    icon: Calendar,
    title: 'Smart Calendar',
    description: 'Auto-populated calendar from assignments and study sessions.',
  },
  {
    icon: FileText,
    title: 'Smart Notes',
    description: 'Tag-based notes with AI-generated summaries and full-text search.',
  },
]

const techStack = [
  { name: 'Next.js', desc: 'React Framework' },
  { name: 'Tailwind CSS', desc: 'Styling' },
  { name: 'Supabase', desc: 'Auth, DB, Storage' },
  { name: 'Gemini AI', desc: 'AI Tutor' },
  { name: 'AWS S3', desc: 'File Storage' },
  { name: 'Redshift', desc: 'Analytics' },
  { name: 'Redis', desc: 'Caching' },
  { name: 'gRPC', desc: 'Services' },
  { name: 'Docker', desc: 'Containerization' },
  { name: 'HDFS', desc: 'Data Lake' },
]

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--accent-primary)] opacity-[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[var(--accent-secondary)] opacity-[0.03] rounded-full blur-[150px]" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[var(--accent-primary)]" />
          <span style={{ fontFamily: 'var(--font-display)' }} className="text-2xl text-[var(--text-primary)]">
            StudyUp
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            Features
          </a>
          <a href="#tech" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            Tech Stack
          </a>
          <Link href="/login" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            Sign In
          </Link>
          <Link href="/login" className="px-4 py-2 text-sm font-medium bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-24 pb-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 mb-8 animate-fade-in">
            <Zap className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span className="text-xs font-medium text-[var(--accent-primary)]">AI-Powered Learning</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-6xl md:text-7xl leading-[1.1] mb-6 animate-fade-in stagger-1">
            Study smarter,
            <br />
            <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
              not harder.
            </span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] leading-relaxed mb-10 max-w-2xl animate-fade-in stagger-2">
            Organize your courses, generate AI study plans, track your progress, and ace your classes — all in one beautifully designed platform.
          </p>
          <div className="flex items-center gap-4 animate-fade-in stagger-3">
            <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-primary)] text-white font-medium rounded-xl hover:bg-[var(--accent-primary-hover)] transition-all hover:shadow-[var(--shadow-glow)] group">
              Start Learning
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a href="#features" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--bg-secondary)] text-[var(--text-secondary)] font-medium rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all">
              Learn More
            </a>
          </div>
        </div>

        <div className="absolute top-16 right-0 w-[500px] h-[400px] opacity-60 hidden lg:block animate-fade-in stagger-4">
          <div className="relative w-full h-full">
            <div className="absolute top-0 right-0 w-[320px] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-5 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/20 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-[var(--accent-primary)]" />
                </div>
                <span className="text-sm font-medium">AI Tutor</span>
              </div>
              <div className="space-y-2.5">
                <div className="bg-[var(--bg-tertiary)] rounded-lg px-3 py-2 text-xs text-[var(--text-secondary)] ml-8">
                  Explain quantum entanglement simply
                </div>
                <div className="bg-[var(--accent-primary)]/10 rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] mr-4">
                  Quantum entanglement is when two particles become linked — measuring one instantly affects the other, no matter the distance...
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-[260px] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-4 shadow-lg">
              <div className="text-xs text-[var(--text-tertiary)] mb-2">Study Progress</div>
              <div className="flex items-end gap-1.5 h-16">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-[var(--accent-primary)] to-[var(--accent-secondary)]" style={{ height: `${h}%`, opacity: 0.3 + (h / 100) * 0.7 }} />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-[var(--text-disabled)]">Mon</span>
                <span className="text-[10px] text-[var(--text-disabled)]">Sun</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 max-w-7xl mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-4xl mb-4">Everything you need to succeed</h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">A complete study platform with AI-powered tools, organized workflows, and smart tracking.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group p-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl hover:border-[var(--border-strong)] transition-all duration-300 cursor-default"
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300 ${hoveredFeature === i ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'}`}>
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="tech" className="relative z-10 max-w-7xl mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-4xl mb-4">Built with modern tools</h2>
          <p className="text-[var(--text-secondary)] text-lg">Enterprise-grade infrastructure for reliable, scalable learning.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {techStack.map((tech, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl hover:border-[var(--border-strong)] transition-colors">
              <span className="text-sm font-medium">{tech.name}</span>
              <span className="text-xs text-[var(--text-tertiary)]">{tech.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-8 py-24">
        <div className="relative overflow-hidden bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 border border-[var(--border-subtle)] rounded-2xl p-12 text-center">
          <div className="absolute inset-0 noise-bg opacity-50" />
          <div className="relative z-10">
            <Shield className="w-10 h-10 text-[var(--accent-primary)] mx-auto mb-6" />
            <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-4xl mb-4">Ready to level up?</h2>
            <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-xl mx-auto">Join StudyUp and transform how you learn. AI-powered, privacy-first, and built for students.</p>
            <Link href="/login" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--accent-primary)] text-white font-medium rounded-xl hover:bg-[var(--accent-primary-hover)] transition-all hover:shadow-[var(--shadow-glow)] group">
              Get Started Free
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-[var(--border-subtle)] mt-12">
        <div className="max-w-7xl mx-auto px-8 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--text-tertiary)]" />
            <span className="text-sm text-[var(--text-tertiary)]">StudyUp</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xs text-[var(--text-disabled)]">Built with Next.js, Supabase, and Gemini AI</span>
            <ExternalLink className="w-4 h-4 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  )
}
