// Database configuration for different environments

export type DatabaseConfig = {
  type: "postgres" | "mysql" | "mongodb" | "sqlite"
  host?: string
  port?: number
  username?: string
  password?: string
  database: string
  url?: string
  ssl?: boolean
  provider?: "supabase"
}

// Default configuration for development
const devConfig: DatabaseConfig = {
  type: "postgres",
  provider: "supabase",
  database: "popya_dev",
  url: process.env.SUPABASE_URL || "",
}

// Configuration for production
const prodConfig: DatabaseConfig = {
  type: "postgres",
  provider: "supabase",
  database: "popya_production",
  url: process.env.SUPABASE_URL || "",
  ssl: true,
}

// Configuration for testing
const testConfig: DatabaseConfig = {
  type: "postgres",
  provider: "supabase",
  database: "popya_test",
  url: process.env.SUPABASE_URL || "",
}

// Export the appropriate configuration based on environment
const env = process.env.NODE_ENV || "development"

const getDatabaseConfig = (): DatabaseConfig => {
  switch (env) {
    case "production":
      return prodConfig
    case "test":
      return testConfig
    default:
      return devConfig
  }
}

export default getDatabaseConfig()
