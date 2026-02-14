import { createFileRoute } from '@tanstack/react-router'

import { prisma } from '@/db'

export const Route = createFileRoute('/api/subscribe/confirm')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const url = new URL(request.url)
        const token = url.searchParams.get('token')
        if (!token) {
          return new Response(
            JSON.stringify({ ok: false, error: 'Missing token' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          )
        }

        const subscriber = await prisma.subscriber.findFirst({
          where: { verifyToken: token },
        })
        if (!subscriber) {
          return new Response(
            JSON.stringify({ ok: false, error: 'Invalid token' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          )
        }

        const now = new Date()
        if (
          !subscriber.verifyTokenExpiresAt ||
          subscriber.verifyTokenExpiresAt < now
        ) {
          return new Response(
            JSON.stringify({ ok: false, error: 'Token expired' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          )
        }

        await prisma.subscriber.update({
          where: { email: subscriber.email },
          data: {
            verified: true,
            verifyToken: null,
            verifyTokenExpiresAt: null,
          },
        })

        return new Response(JSON.stringify({ ok: true, verified: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  },
})
