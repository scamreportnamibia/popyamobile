#!/usr/bin/env node

/**
 * Popya Mobile App Deployment Script
 *
 * This script helps with the deployment process by:
 * 1. Checking environment variables
 * 2. Testing database connection
 * 3. Running database migrations
 * 4. Building the application
 * 5. Deploying to Vercel
 */

const { execSync } = require("child_process")
const { Pool } = require("pg")
const readline = require("readline")
const fs = require("fs")

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Load environment variables
require("dotenv").config()

// Check environment variables
const requiredEnvVars = [
  "DATABASE_URL",
  "JWT_SECRET",
  "NEXT_PUBLIC_PRODUCTION_MODE",
  "NEXT_PUBLIC_SIGNALING_SERVER_URL",
]

console.log("🔍 Checking environment variables...")
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

if (missingEnvVars.length > 0) {
  console.error("❌ Missing environment variables:", missingEnvVars.join(", "))
  process.exit(1)
}

console.log("✅ All required environment variables are set.")

// Test database connection
console.log("🔌 Testing database connection...")

async function testDatabaseConnection() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })

  try {
    const client = await pool.connect()
    const result = await client.query("SELECT NOW()")
    console.log("✅ Database connection successful:", result.rows[0].now)
    client.release()
    return true
  } catch (err) {
    console.error("❌ Database connection failed:", err.message)
    return false
  } finally {
    await pool.end()
  }
}

// Build and deploy
async function buildAndDeploy() {
  try {
    console.log("🏗️ Building application...")
    execSync("npm run build", { stdio: "inherit" })

    console.log("🚀 Deploying to Vercel...")
    execSync("vercel --prod", { stdio: "inherit" })

    console.log("✅ Deployment completed successfully!")
  } catch (err) {
    console.error("❌ Deployment failed:", err.message)
    process.exit(1)
  }
}

// Main function
async function main() {
  const dbConnected = await testDatabaseConnection()

  if (!dbConnected) {
    rl.question("Database connection failed. Do you want to continue anyway? (y/n) ", (answer) => {
      if (answer.toLowerCase() === "y") {
        buildAndDeploy()
      } else {
        console.log("Deployment aborted.")
        process.exit(0)
      }
      rl.close()
    })
  } else {
    buildAndDeploy()
    rl.close()
  }
}

main()
