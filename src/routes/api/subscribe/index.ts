import { createFileRoute } from '@tanstack/react-router'
import { prisma } from '@/db'
import { sendVerificationEmail } from '@/lib/mailer'

export const Route = createFileRoute('/api/subscribe/')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const body = await request.json()
        const email = (body?.email || '').toString().trim().toLowerCase()
        const name = body?.name ? String(body.name).trim() : undefined

        if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
          return new Response(
            JSON.stringify({ ok: false, error: 'Invalid email' }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            },
          )
        }

        try {
          let existing = await prisma.subscriber.findUnique({
            where: { email },
          })

          // generate verification token (24h)
          const { randomBytes } = await import('crypto')
          const token = randomBytes(20).toString('hex')
          const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

          if (!existing) {
            existing = await prisma.subscriber.create({
              data: {
                email,
                name,
                source: 'landing-page',
                verified: false,
                verifyToken: token,
                verifyTokenExpiresAt: expires,
              },
            })
          } else {
            if (!existing.verified) {
              await prisma.subscriber.update({
                where: { email },
                data: { verifyToken: token, verifyTokenExpiresAt: expires },
              })
            }
            if (name && existing.name !== name) {
              await prisma.subscriber.update({
                where: { email },
                data: { name },
              })
            }
          }

          const mailResult = await sendVerificationEmail({
            to: email,
            name,
            token,
          })

          return new Response(
            JSON.stringify({ ok: true, created: !existing, mailResult }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          )
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err)
          return new Response(
            JSON.stringify({ ok: false, error: 'Server error' }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            },
          )
        }
      },
    },
  },
})
