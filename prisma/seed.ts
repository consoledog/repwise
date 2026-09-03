import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth/password'

const prisma = new PrismaClient()

type SeedUser = {
  email: string
  name: string
  password: string
}

function getSeedUsers(): SeedUser[] {
  const configuredUsers = [
    {
      email: process.env.REPWISE_SEED_USER_1_EMAIL,
      name: process.env.REPWISE_SEED_USER_1_NAME ?? 'Owner',
      password: process.env.REPWISE_SEED_USER_1_PASSWORD,
    },
    {
      email: process.env.REPWISE_SEED_USER_2_EMAIL,
      name: process.env.REPWISE_SEED_USER_2_NAME ?? 'Partner',
      password: process.env.REPWISE_SEED_USER_2_PASSWORD,
    },
  ].filter((user): user is SeedUser => Boolean(user.email && user.password))

  if (configuredUsers.length > 0 || process.env.NODE_ENV === 'production') {
    return configuredUsers
  }

  return [
    {
      email: 'owner@example.com',
      name: 'Owner',
      password: 'password123',
    },
    {
      email: 'partner@example.com',
      name: 'Partner',
      password: 'password123',
    },
  ]
}

function validateSeedUsers(users: SeedUser[]) {
  for (const user of users) {
    if (user.email.trim().toLowerCase() === 'x' || user.password === 'x') {
      throw new Error('Seed user email and password must not use placeholder value "x".')
    }

    if (user.password.length < 8) {
      throw new Error(`Seed password for ${user.email} must contain at least 8 characters.`)
    }
  }
}

async function main() {
  const users = getSeedUsers()

  if (users.length === 0) {
    throw new Error('No seed users configured.')
  }

  validateSeedUsers(users)

  for (const user of users) {
    const passwordHash = await hashPassword(user.password)

    await prisma.user.upsert({
      where: {
        email: user.email.toLowerCase(),
      },
      update: {
        name: user.name,
        passwordHash,
      },
      create: {
        email: user.email.toLowerCase(),
        name: user.name,
        passwordHash,
      },
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
