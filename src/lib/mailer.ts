import nodemailer from 'nodemailer'

const host = process.env.SMTP_HOST
const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
const secure = process.env.SMTP_SECURE === 'true'
const user = process.env.SMTP_USER
const pass = process.env.SMTP_PASS
const from = process.env.SMTP_FROM || 'Cozmic AI <no-reply@cozmic.ai>'

let transporter: ReturnType<typeof nodemailer.createTransport> | undefined

function getTransporter() {
  if (transporter) return transporter

  if (!host || !port || !user || !pass) {
    // In dev, fallback to a JSON-logger transport so subscription still works
    transporter = {
      sendMail: async (mail: any) => {
        // eslint-disable-next-line no-console
        console.log('[mailer] SMTP not configured — mail payload: ', mail)
        return { messageId: 'dev-log' }
      },
    } as any
  } else {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    })
  }

  return transporter!
}

export async function sendConfirmationEmail({
  to,
  name,
}: {
  to: string
  name?: string | null
}) {
  const t = getTransporter()

  const subject = 'Thanks for joining the cozmic.ai waitlist — welcome!'
  const text = `Hi ${name || 'friend'},\n\nThanks for joining the cozmic.ai waitlist. We'll email you when early access opens.\n\n— cozmic.ai Team`
  const html = `
    <div style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; color: #111">
      <h2 style="color: #2E1A47">Welcome to cozmic.ai</h2>
      <p>Hi ${name || 'friend'},</p>
      <p>Thanks for joining the <strong>cozmic.ai</strong> waitlist. We'll email you when early access opens — expect cosmic perks ✨</p>
      <p style="color: #888; font-size: 13px">— The cozmic.ai Team</p>
    </div>
  `

  try {
    const info = await t.sendMail({
      from,
      to,
      subject,
      text,
      html,
    })

    return { ok: true, info }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to send confirmation email', err)
    return { ok: false, error: (err as Error).message }
  }
}

export async function sendVerificationEmail({
  to,
  token,
  name,
}: {
  to: string
  token: string
  name?: string | null
}) {
  const t = getTransporter()
  const origin = process.env.APP_URL || 'http://localhost:3000'
  const link = `${origin}/api/subscribe/confirm?token=${encodeURIComponent(token)}`

  const subject = 'Confirm your email for cozmic.ai'
  const text = `Hi ${name || 'friend'},\n\nClick to confirm your email: ${link}\n\nIf you didn't sign up, ignore this message.`
  const html = `
    <div style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; color: #111">
      <h2 style="color: #2E1A47">Confirm your email</h2>
      <p>Hi ${name || 'friend'},</p>
      <p>Click the link below to confirm your email for <strong>cozmic.ai</strong>:</p>
      <p><a href="${link}">${link}</a></p>
      <p style="color: #888; font-size: 13px">— The cozmic.ai Team</p>
    </div>
  `

  try {
    const info = await t.sendMail({
      from,
      to,
      subject,
      text,
      html,
    })

    return { ok: true, info }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to send verification email', err)
    return { ok: false, error: (err as Error).message }
  }
}
