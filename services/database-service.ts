import { getServerClient } from "@/lib/supabase-client"

// Function to execute queries using Supabase
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  try {
    const supabase = getServerClient()
    const { data, error } = await supabase.rpc("execute_sql", { query_text: query, query_params: params })

    if (error) throw error
    return data as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Function to check database connection
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const supabase = getServerClient()
    const { error } = await supabase.from("_health").select("*").limit(1)
    return !error
  } catch (error) {
    console.error("Database connection error:", error)
    return false
  }
}

// Generic function to fetch data from a table
export async function fetchFromTable<T>(table: string, query: any = {}): Promise<T[]> {
  try {
    const supabase = getServerClient()
    const { data, error } = await supabase
      .from(table)
      .select(query.select || "*")
      .order(query.orderBy || "id", { ascending: query.ascending !== false })
      .limit(query.limit || 100)
      .range(query.start || 0, (query.start || 0) + (query.limit || 100) - 1)

    if (error) throw error
    return data as T[]
  } catch (error) {
    console.error(`Error fetching from ${table}:`, error)
    throw error
  }
}

// Generic function to insert data into a table
export async function insertIntoTable<T>(table: string, data: any): Promise<T> {
  try {
    const supabase = getServerClient()
    const { data: result, error } = await supabase.from(table).insert(data).select().single()

    if (error) throw error
    return result as T
  } catch (error) {
    console.error(`Error inserting into ${table}:`, error)
    throw error
  }
}

// Generic function to update data in a table
export async function updateInTable(table: string, id: number | string, data: any): Promise<void> {
  try {
    const supabase = getServerClient()
    const { error } = await supabase.from(table).update(data).eq("id", id)

    if (error) throw error
  } catch (error) {
    console.error(`Error updating in ${table}:`, error)
    throw error
  }
}

// Generic function to delete data from a table
export async function deleteFromTable(table: string, id: number | string): Promise<void> {
  try {
    const supabase = getServerClient()
    const { error } = await supabase.from(table).delete().eq("id", id)

    if (error) throw error
  } catch (error) {
    console.error(`Error deleting from ${table}:`, error)
    throw error
  }
}
