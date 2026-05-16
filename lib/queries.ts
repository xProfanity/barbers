import {dbClient} from "./pg-client.ts"

export async function fetchAuthUserByPhone(phone: string) {
	const client = await dbClient()
	const query = `select * from users where phone=$1`
	try {
		const result = await client.query({text: query, values: [phone]})
		await client.release()
		
		return result.rows[0]
	} catch (err) {
		console.log(err)	
	}
}

export async function fetchIfPhoneAlreadyExist(phone: string) {
	const client = await dbClient()
	const query = `select exists(select phone from users where phone=$1) as alreadyExists`

	try {
		const result = await client.query({text: query, values: [phone]})	
		await client.release()

		return result.rows[0].alreadyexists
	} catch (error) {
		console.log(error)	
	}
}

export async function createUserRecord(record) {
	const client = await dbClient()
	const query = "insert into users(username,phone,password_hash) values($1,$2,$3)"
	
	try {
		const result = await client.query({text: query, values: record})
		await client.release()

		return result.command === 'INSERT'
	} catch (error) {
		console.log(error)	
	}
}

export async function createUserSession(phone) {
	const client = await dbClient()
	const userQuery = "select id from users where phone=$1"
	const sessionInsertQuery = "insert into sessions(user_id, expires_at) values($1, now() + interval '5 days')"
	const sessionGetQuery = "select id from sessions where user_id=$1"

	try {
		const userResult = await client.query({text: userQuery, values: [phone]})
		const sessionResult = await client.query({text: sessionInsertQuery, values: [userResult.rows[0].id]})
		if (sessionResult.command === 'INSERT') {
			const sessionRows = await client.query({text: sessionGetQuery, values: [userResult.rows[0].id]})
			await client.release()
			return sessionRows.rows[0]
		}
		await client.release()
		return null
	} catch (error) {
		console.log(error)	
	}
	
}

export async function fetchSessionBySessionId(session) {
	const client = await dbClient()
	const query = "select * from sessions where id=$1"

	try {
		const result = await client.query({text: query, values: session})	
		if(result.rows?.length === 0) return null
		await client.release()
		return result.rows[0]
	} catch (error) {
		console.log(error)	
	}
}
