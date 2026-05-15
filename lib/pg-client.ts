import {Pool} from "pg"

const pool = new Pool({
	database: 'barbers',
	user: 'postgres',
	port: 5432,
	ssl: process.env.NODE_ENV === "production",
	max: 20,
	idleTimeoutMillis: 1000,
	connectionTimeoutMillis: 1000,
	maxUses: 7500,
})

export async function dbClient() {
	try {
		const client = await pool.connect()
		return client
	} catch(err) {
		console.error("Connection error", err)
		throw err instanceof Error ? err : new Error(String(err))
	}
}
