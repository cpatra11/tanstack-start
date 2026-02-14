import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import CozmicLanding from '@/components/Landing'

export const Route = createFileRoute('/')({ component: CozmicLanding })

function App() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>(
    'idle',
  )
  const [message, setMessage] = useState('')

  async function subscribe(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })
      const data = await res.json()
      if (data?.ok) {
        setStatus('ok')
        setMessage('Thanks — check your inbox for a confirmation email ✨')
        setEmail('')
        setName('')
      } else {
        setStatus('error')
        setMessage(data?.error || 'Something went wrong')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Network error')
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#0D0B1A' }}>
      {/* Hero */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(1200px 600px at 10% 10%, rgba(157,78,221,0.12), transparent), radial-gradient(800px 400px at 90% 80%, rgba(45,26,71,0.12), transparent)',
          }}
        />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="mb-8 inline-flex items-center gap-3">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
              The First AI That Actually Understands Your Karma
            </h1>
            <span
              className="ml-2 w-3 h-3 rounded-full animate-pulse"
              style={{
                background: '#FFD60A',
                boxShadow: '0 0 12px rgba(255,214,10,0.6)',
              }}
            />
          </div>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            You’ve checked your daily horoscope and felt left with questions.
            cozmic.ai reads your unique chart and gives clear, instant guidance
            — no vague lines, just useful steps.
          </p>

          {/* CTA / Waitlist Form */}
          <form
            onSubmit={subscribe}
            className="mx-auto max-w-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] backdrop-blur-sm rounded-2xl p-6 flex flex-col md:flex-row gap-4 items-center"
          >
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                aria-label="Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="col-span-1 md:col-span-1 px-4 py-3 rounded-lg bg-transparent border border-[rgba(255,255,255,0.06)] text-white placeholder-gray-400"
              />
              <input
                aria-label="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="col-span-2 md:col-span-2 px-4 py-3 rounded-lg bg-transparent border border-[rgba(255,255,255,0.08)] text-white placeholder-gray-400"
                type="email"
              />
            </div>

            <div className="flex-shrink-0">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-black"
                style={{ background: 'linear-gradient(90deg,#9D4EDD,#2E1A47)' }}
                disabled={status === 'loading'}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`rounded-full ${status === 'loading' ? 'animate-spin' : ''}`}
                >
                  <circle cx="50" cy="50" r="40" fill="#FFD60A" />
                </svg>
                <span className="text-white">Secure My Cosmic Perks →</span>
              </button>
            </div>

            <div className="w-full text-left text-sm text-gray-400 mt-3 md:mt-0 md:ml-4">
              <div>No spam. Just cosmic insights. Unsubscribe anytime.</div>
            </div>
          </form>

          {message && (
            <div
              className={`mt-4 mx-auto max-w-2xl text-sm ${
                status === 'ok' ? 'text-green-400' : 'text-rose-400'
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </section>

      {/* Pain / Agitation */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-3">
              The Waiting Game
            </h3>
            <p className="text-gray-400">
              You shouldn't wait days for guidance. Get answers instantly.
            </p>
          </div>
          <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-3">
              The Confusion
            </h3>
            <p className="text-gray-400">
              No jargon — just clear steps for love, career, and timing.
            </p>
          </div>
          <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-3">
              The Loneliness
            </h3>
            <p className="text-gray-400">
              A guide that never sleeps — ask anything, anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Solution / Benefits */}
      <section className="py-16 px-6 bg-[rgba(255,255,255,0.01)] border-t border-[rgba(255,255,255,0.02)]">
        <div className="max-w-6xl mx-auto text-center mb-8">
          <h2 className="text-3xl font-bold text-white">
            Meet the Guide You’ve Been Waiting For
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto mt-3">
            Personalized chart analysis, 24/7 chat, and clear remedies you can
            act on today.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-gradient-to-b from-[rgba(157,78,221,0.06)] to-transparent border border-[rgba(157,78,221,0.06)]">
            <h4 className="text-xl font-semibold text-white mb-2">
              24/7 Confidant
            </h4>
            <p className="text-gray-400">
              Never feel alone — instant, judgment-free answers.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-b from-[rgba(45,26,71,0.06)] to-transparent border border-[rgba(45,26,71,0.06)]">
            <h4 className="text-xl font-semibold text-white mb-2">
              Personalized Prophet
            </h4>
            <p className="text-gray-400">
              Kundli analysis tailored to your exact chart and timing.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-b from-[rgba(255,214,10,0.03)] to-transparent border border-[rgba(255,214,10,0.03)]">
            <h4 className="text-xl font-semibold text-white mb-2">
              Clarity Compass
            </h4>
            <p className="text-gray-400">
              Actionable remedies you can apply today to change momentum.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h3 className="text-2xl font-bold text-white">
            Clarity in Three Steps
          </h3>
          <p className="text-gray-400 mt-3">
            Enter your birth details → Ask anything → Receive guidance.
          </p>
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] text-center">
            <div className="text-3xl mb-3">📅</div>
            <h4 className="font-semibold text-white">Enter birth details</h4>
          </div>
          <div className="p-6 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] text-center">
            <div className="text-3xl mb-3">💬</div>
            <h4 className="font-semibold text-white">
              Ask anything — no judgment
            </h4>
          </div>
          <div className="p-6 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] text-center">
            <div className="text-3xl mb-3">💡</div>
            <h4 className="font-semibold text-white">Get clear guidance</h4>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-16 px-6 bg-[rgba(255,255,255,0.01)] border-t border-[rgba(255,255,255,0.02)]">
        <div className="max-w-6xl mx-auto text-center mb-6">
          <h3 className="text-2xl font-bold text-white">
            Join the Cosmic Revolution
          </h3>
          <p className="text-gray-400 mt-3">
            5,000+ Seekers have already reserved their spot.
          </p>
        </div>
        <div className="max-w-4xl mx-auto grid gap-4">
          <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)]">
            <strong className="text-white">
              "I asked the beta about my career switch... Uncanny."
            </strong>
            <div className="text-gray-400 text-sm mt-2">
              — Priya K., Early Tester
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)]">
            <strong className="text-white">
              "Finally, something that speaks my language AND understands my
              chart."
            </strong>
            <div className="text-gray-400 text-sm mt-2">— Arjun M.</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-gray-400">
        <div className="max-w-6xl mx-auto">
          <p className="mb-4 text-white font-semibold">
            The universe is talking. Finally, someone to translate.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <a href="#" className="hover:text-white">
              About
            </a>
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

// keep legacy `App` available for reference during iteration
void App
