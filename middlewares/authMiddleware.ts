import {getCookie} from "hono/cookie"
import {fetchUserBySessionId} from "../lib/queries"

export default async function authMiddleware(c, next) {
	const sessionId = getCookie(c, "session_id")
	
	if (!sessionId) return c.redirect("/auth")

	const userSession = await fetchUserBySessionId([sessionId])

	if(!userSession) return c.redirect("/auth")
	
	c.set("user", {...userSession})

	await next()
}
