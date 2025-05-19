import { executeQuery } from "@/lib/neon-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DatabaseStatus } from "@/components/database-status"

async function getTables() {
  try {
    const tables = await executeQuery(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)
    return tables
  } catch (error) {
    console.error("Error fetching tables:", error)
    return []
  }
}

export default async function DatabaseAdminPage() {
  const tables = await getTables()

  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold">Database Administration</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <DatabaseStatus />

        <Card>
          <CardHeader>
            <CardTitle>Database Tables</CardTitle>
            <CardDescription>List of tables in your Neon PostgreSQL database</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.length > 0 ? (
                  tables.map((table: any) => (
                    <TableRow key={table.table_name}>
                      <TableCell>{table.table_name}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={1} className="text-center">
                      No tables found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
