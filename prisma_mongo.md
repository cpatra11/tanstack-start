Quickstart with Prisma ORM and MongoDB
MongoDB is a popular NoSQL document database. In this guide, you will learn how to set up a new TypeScript project from scratch, connect it to MongoDB using Prisma ORM, and generate a Prisma Client for easy, type-safe access to your database.

MongoDB support for Prisma ORM v7
MongoDB support for Prisma ORM v7 is coming in the near future. In the meantime, please use Prisma ORM v6.19 (the latest v6 release) when working with MongoDB.

This guide uses Prisma ORM v6.19 to ensure full compatibility with MongoDB.

Prerequisites
Node.js installed in your system with the supported version
A MongoDB database accessible via connection string

1. Create a new project
   Create a project directory and navigate into it:

mkdir hello-prisma
cd hello-prisma

Initialize a TypeScript project:

npm init -y
npm install typescript tsx @types/node --save-dev
npx tsc --init

2. Install required dependencies
   Install the packages needed for this quickstart:

npm install prisma@6.19 @types/node --save-dev
npm install @prisma/client@6.19 dotenv

Why Prisma v6.19?
This is the latest stable version of Prisma ORM v6 that fully supports MongoDB. MongoDB support for Prisma ORM v7 is coming soon.

You can also install prisma@6 and @prisma/client@6 to automatically get the latest v6 release.

Here's what each package does:

prisma - The Prisma CLI for running commands like prisma init, prisma db push, and prisma generate
@prisma/client - The Prisma Client library for querying your database
dotenv - Loads environment variables from your .env file
note
MongoDB doesn't require driver adapters since Prisma ORM connects directly to MongoDB.

3. Configure ESM support
   Update tsconfig.json for ESM compatibility:

tsconfig.json
{
"compilerOptions": {
"module": "ESNext",
"moduleResolution": "bundler",
"target": "ES2023",
"strict": true,
"esModuleInterop": true,
"ignoreDeprecations": "6.0"
}
}

Update package.json to enable ESM:

package.json
{
"type": "module",
}

4. Initialize Prisma ORM
   You can now invoke the Prisma CLI by prefixing it with npx:

npx prisma

Next, set up your Prisma ORM project by creating your Prisma Schema file with the following command:

npx prisma init --datasource-provider mongodb --output ../generated/prisma

This command does a few things:

Creates a prisma/ directory with a schema.prisma file for your database connection and schema models
Creates a .env file in the root directory for environment variables
Creates a prisma.config.ts file for Prisma configuration
note
Prisma Client will be generated in the generated/prisma/ directory when you run npx prisma generate later in this guide.

The generated prisma.config.ts file looks like this:

prisma.config.ts
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
schema: 'prisma/schema.prisma',
migrations: {
path: 'prisma/migrations',
},
engine: "classic",
datasource: {
url: env('DATABASE_URL'),
},
})

Add dotenv to prisma.config.ts so that Prisma can load environment variables from your .env file:

prisma.config.ts
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
schema: 'prisma/schema.prisma',
migrations: {
path: 'prisma/migrations',
},
engine: "classic",
datasource: {
url: env('DATABASE_URL'),
},
})

The generated schema uses the ESM-first prisma-client generator with a custom output path:

prisma/schema.prisma
generator client {
provider = "prisma-client"
output = "../generated/prisma"
}

datasource db {
provider = "mongodb"
url = env("DATABASE_URL")
}

Update your .env file with your MongoDB connection string:

.env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/mydb"

tip
Replace username, password, cluster, and mydb with your actual MongoDB credentials and database name. You can get your connection string from MongoDB Atlas or your MongoDB deployment.

5. Define your data model
   Open prisma/schema.prisma and add the following models:

prisma/schema.prisma
generator client {
provider = "prisma-client"
output = "../generated/prisma"
}

datasource db {
provider = "mongodb"
url = env("DATABASE_URL")
}

model User {
id String @id @default(auto()) @map("\_id") @db.ObjectId
email String @unique
name String?
posts Post[]
}

model Post {
id String @id @default(auto()) @map("\_id") @db.ObjectId
title String
content String?
published Boolean @default(false)
author User @relation(fields: [authorId], references: [id])
authorId String @db.ObjectId
}

6. Push your schema to MongoDB
   MongoDB doesn't support migrations like relational databases. Instead, use db push to sync your schema:

npx prisma db push

This command:

Creates the collections in MongoDB based on your schema
Automatically generates Prisma Client
info
Unlike relational databases, MongoDB uses a flexible schema. The db push command ensures your Prisma schema is reflected in your database without creating migration files.

7. Instantiate Prisma Client
   Now that you have all the dependencies installed, you can instantiate Prisma Client:

lib/prisma.ts
import "dotenv/config";
import { PrismaClient } from '../generated/prisma/client'

const prisma = new PrismaClient()

export { prisma }

8. Write your first query
   Create a script.ts file to test your setup:

script.ts
import { prisma } from './lib/prisma'

async function main() {
// Create a new user with a post
const user = await prisma.user.create({
data: {
name: 'Alice',
email: 'alice@prisma.io',
posts: {
create: {
title: 'Hello World',
content: 'This is my first post!',
published: true,
},
},
},
include: {
posts: true,
},
})
console.log('Created user:', user)

// Fetch all users with their posts
const allUsers = await prisma.user.findMany({
include: {
posts: true,
},
})
console.log('All users:', JSON.stringify(allUsers, null, 2))
}

main()
.then(async () => {
await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
process.exit(1)
})

Run the script:

npx tsx script.ts

You should see the created user and all users printed to the console!

9. Explore your data
   You can use MongoDB Atlas, the MongoDB shell, or MongoDB Compass to view and manage your data.

Prisma Studio does not currently support MongoDB. Support may be added in a future release. See Databases supported by Prisma Studio for more information.

Next steps
You've successfully set up Prisma ORM. Here's what you can explore next:

Learn more about Prisma Client: Explore the Prisma Client API for advanced querying, filtering, and relations
Database migrations: Learn about Prisma Migrate for evolving your database schema
Performance optimization: Discover query optimization techniques
Build a full application: Check out our framework guides to integrate Prisma ORM with Next.js, Express, and more
Join the community: Connect with other developers on Discord
Troubleshooting
Error in connector: SCRAM failure: Authentication failed.
If you see the Error in connector: SCRAM failure: Authentication failed. error message, you can specify the source database for the authentication by adding ?authSource=admin to the end of the connection string.

Raw query failed. Error code 8000 (AtlasError): empty database name not allowed.
If you see the Raw query failed. Code: unknown. Message: Kind: Command failed: Error code 8000 (AtlasError): empty database name not allowed. error message, be sure to append the database name to the database URL. You can find more info in this GitHub issue.
