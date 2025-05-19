// Database migration script for Supabase
const fs = require("fs")
const path = require("path")
const { createClient } = require("@supabase/supabase-js")

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrate() {
  console.log("Running migrations with Supabase...")

  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, "schema.sql")
    const schema = fs.readFileSync(schemaPath, "utf8")

    // Execute the schema using Supabase's SQL function
    console.log("Executing schema...")

    // Split the schema into individual statements
    const statements = schema
      .split(";")
      .map((statement) => statement.trim())
      .filter((statement) => statement.length > 0)

    // Execute each statement
    for (const statement of statements) {
      const { error } = await supabase.rpc("execute_sql", {
        query_text: statement,
      })

      if (error) {
        console.error("Migration statement failed:", error)
        console.error("Failed statement:", statement)
      }
    }

    console.log("Migration completed successfully!")
  } catch (error) {
    console.error("Migration script failed:", error)
    process.exit(1)
  }
}

// Run the migration
migrate().catch((err) => {
  console.error("Unhandled error:", err)
  process.exit(1)
})
