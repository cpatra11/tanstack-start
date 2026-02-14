import { PrismaClient } from '../src/generated/prisma/client.js'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing subscribers
  await prisma.subscriber.deleteMany()

  // Create example subscribers
  const subs = await prisma.subscriber.createMany({
    data: [
      { email: 'priya@example.com', name: 'Priya K', source: 'seed' },
      { email: 'arjun@example.com', name: 'Arjun M', source: 'seed' },
      { email: 'test@example.com', name: 'Test User', source: 'seed' },
    ],
  })

  console.log(`✅ Created ${subs.count} subscribers`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
