import {dbClient} from "./pg-client.ts"

export async function countAppointmentsForAService(service_id) {
	const client = await dbClient()
	const query = "select count(*) as no_appointments from appointments where service_id=$1"

	try {
		const result = await client.query({text: query, values: service_id})	
		return result.rows[0].no_appointments
	} catch (error) {
		console.error(error)	
		throw error
	} finally {
		client.release()
	}
}

export async function postServiceAppointment(service_id) {
	const client = await dbClient()
	const query = "insert into appointments(user_id, barber_id, service_id) values($1, 1, $2) on conflict(user_id) do nothing"
	
	try {
		const result = await client.query({text: query, values: service_id})	
		return !!result.rowCount
	} catch (error) {
		console.error(error)	
		throw error
	} finally {
		client.release()
	}
}

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

export async function fetchUserAppointment(user_id) {
	const client = await dbClient()
	const query = "select count(*) from appointments a where a.user_id=$1"

	try {
		const result = await client.query({text: query, values: user_id})	
		console.log("count", result.rows[0].count)
		return result.rows[0].count
	} catch (error) {
		console.error(error)	
		throw error
	}
}

export async function fetchAvailableServices(appointment) {
	const client = await dbClient()
	const query = 'select s.id, s.description, s.price, s.name, s.duration_minutes, s.active, exists(select 1 from appointments a where a.service_id=s.id and a.user_id=$1) as booked from services s left join appointments a on a.service_id=s.id where s.active group by s.id, s.name, s.description, s.price, s.duration_minutes, s.active'

	try {
		const result = await client.query({text: query, values: appointment})
	
		return result.rows
	} catch (error) {
		console.error(error)	
		throw error
	} finally {
		client.release()
	}
}
