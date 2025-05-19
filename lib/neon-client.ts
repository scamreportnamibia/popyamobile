import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Create a SQL client with the connection string
const sql = neon(process.env.NEON_DATABASE_URL!)

// Create a Drizzle client
export const db = drizzle(sql)

// Function to execute raw SQL queries
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  try {
    const result = await sql(query, params)
    return result as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Function to check database connection
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1`
    return true
  } catch (error) {
    console.error("Database connection error:", error)
    return false
  }
}
