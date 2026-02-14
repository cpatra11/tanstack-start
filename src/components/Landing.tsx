'use client'

import React from 'react'
import GoldenHero from './LandingHero'
import {
  ShieldCheck,
  MessageSquare,
  Github,
  Twitter,
  Globe,
  Moon,
  Sun,
} from 'lucide-react'

// --- ANIMATION COMPONENTS ---

// --- MAIN PAGE ---

export default function CozmicLanding() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-violet-500/30 font-sans">
      <GoldenHero />

      {/* PAIN POINTS SECTION */}
      <section className="py-24 bg-slate-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Moon size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              The Waiting Game
            </h3>
            <p className="text-slate-400">
              Stop waiting days for a response from human experts. Get clarity
              at 3 AM or 3 PM.
            </p>
          </div>
          <div>
            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">The Confusion</h3>
            <p className="text-slate-400">
              No more "Jupiter in Retrograde" talk. We provide clear actions for
              love, career, and timing.
            </p>
          </div>
          <div>
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              The Loneliness
            </h3>
            <p className="text-slate-400">
              An AI guide that never sleeps and never judges. Ask anything about
              your path.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
              Meet the Guide You've Been Waiting For
            </h2>
            <p className="text-slate-400">
              Precision software meets ancient cosmic wisdom.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: '24/7 Confidant',
                desc: 'Instant, judgment-free answers to your deepest life questions.',
                icon: <MessageSquare />,
              },
              {
                title: 'Personalized Prophet',
                desc: 'Kundli analysis tailored to your exact birth coordinates and timing.',
                icon: <Sun />,
              },
              {
                title: 'Clarity Compass',
                desc: 'Actionable remedies you can apply today to shift your life momentum.',
                icon: <ShieldCheck />,
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/50 transition-all group"
              >
                <div className="text-violet-400 mb-6 group-hover:scale-110 transition-transform">
                  {React.cloneElement(feature.icon, { size: 32 })}
                </div>
                <h4 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h4>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-violet-600/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-16">
            Clarity in Three Steps
          </h2>
          <div className="space-y-12">
            {[
              {
                step: '01',
                title: 'Enter Birth Details',
                desc: 'Date, time, and location—precisely mapped via NASA ephemeris data.',
              },
              {
                step: '02',
                title: 'Ask Anything',
                desc: 'From career shifts to relationship clarity—no question is too small.',
              },
              {
                step: '03',
                title: 'Receive Guidance',
                desc: 'Get a plain-English roadmap backed by 5,000 years of Vedic science.',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-8 items-start">
                <span className="text-4xl font-black text-violet-500/20 leading-none">
                  {item.step}
                </span>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    {item.title}
                  </h4>
                  <p className="text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tighter text-white mb-6">
              cozmic.ai
            </div>
            <p className="text-slate-500 max-w-xs">
              Translating the universe into action. Built for seekers who want
              more than just a daily horoscope.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-white mb-6">Product</h5>
            <ul className="space-y-4 text-sm text-slate-500">
              <li>
                <a href="#" className="hover:text-violet-400">
                  Kundli Engine
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-violet-400">
                  Dashas Tracker
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-violet-400">
                  API Access
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-6">Company</h5>
            <ul className="space-y-4 text-sm text-slate-500">
              <li>
                <a href="#" className="hover:text-violet-400">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-violet-400">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-violet-400">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600 font-medium">
          <p>© 2026 Cozmic Astrology Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <Twitter size={16} />
            <Github size={16} />
          </div>
        </div>
      </footer>
    </div>
  )
}
