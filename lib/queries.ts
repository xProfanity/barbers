import {dbClient} from "./pg-client.ts"

export async function deleteUserSession(user_id) {
	const client = await dbClient()
	const query = 'delete from sessions where user_id=$1'
	try {
		await client.query({text: query, values: user_id})	
	} catch (error) {
		console.error(error)	
		throw error
	} finally {
		client.release()
	}
}

export async function fetchAuthUserByPhone(phone: string) {
	const client = await dbClient()
	const query = `select * from users where phone=$1`
	try {
		const result = await client.query({text: query, values: [phone]})
		
		return result.rows[0]
	} catch (error) {
		console.error(error)	
		throw error
	} finally {
		client.release()
	}
}

export async function fetchIfPhoneAlreadyExist(phone: string) {
	const client = await dbClient()
	const query = `select exists(select phone from users where phone=$1) as alreadyExists`

	try {
		const result = await client.query({text: query, values: [phone]})	

		return result.rows[0].alreadyexists
	} catch (error) {
		console.error(error)	
		throw error
	} finally {
		client.release()
	}
}

export async function createUserRecord(record) {
	const client = await dbClient()
	const query = "insert into users(username,phone,password_hash) values($1,$2,$3)"
	
	try {
		const result = await client.query({text: query, values: record})

		return result.command === 'INSERT'
	} catch (error) {
		console.error(error)	
		throw error
	} finally {
		client.release()
	}
}

export async function createUserSession(phone) {
	const client = await dbClient()
	const userQuery = "select id from users where phone=$1"
	const sessionInsertQuery = "insert into sessions(user_id, expires_at) values($1, now() + interval '5 days') returning id, user_id, expires_at"

	try {
		const userResult = await client.query({text: userQuery, values: [phone]})
		if (!userResult.rows[0]?.id) return null
		const sessionResult = await client.query({text: sessionInsertQuery, values: [userResult.rows[0].id]})
		return sessionResult.rows[0]
	} catch (error) {
		console.error(error)	
		throw error
	} finally {
		client.release()
	}
	
}

export async function fetchUserBySessionId(session) {
	const client = await dbClient()
	const query = "select users.id as id, phone, username, role, sessions.id as session_id from sessions left join users on sessions.user_id=users.id where sessions.id=$1"

	try {
		const result = await client.query({text: query, values: session})	
		if(result.rows?.length === 0) return null
		return result.rows[0]
	} catch (error) {
		console.error(error)	
		throw error
	} finally {
		client.release()
	}
}

/**
 * Fetches all notification records for a given user.
 *
 * @param user_id - The identifier of the user whose notifications will be retrieved
 * @returns An array of notification rows belonging to the specified user
 * @throws When the database query fails
 */
export async function fetchUserNotifications(user_id) {
	const client = await dbClient()
	const query = "select * from notifications where user_id=$1"

	try {
		const result = await client.query({text: query, values: user_id})	
		return result.rows
	} catch (error) {
		console.error(error)	
		throw error
	} finally {
		client.release()
	}
}

/**
 * Retrieves active services and their total booking counts.
 *
 * @returns An array of rows where each row contains: `id`, `description`, `price`, `name`, `duration_minutes`, `active`, and `total_bookings`
 */
export async function fetchAvailableServices() {
	const client = await dbClient()
	const query = 'select s.id, s.description, s.price, s.name, s.duration_minutes, s.active, count(a.id) as total_bookings from services s left join appointments a on a.service_id=s.id where s.active group by s.id, s.name, s.description, s.price, s.duration_minutes, s.active'

	try {
		const result = await client.query(query)
	
		return result.rows
	} catch (error) {
		console.error(error)	
		throw error
	} finally {
		client.release()
	}
}
