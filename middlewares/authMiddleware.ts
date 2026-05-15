import {getCookie} from "hono/cookie"
import {fetchSessionBySessionId} from "../lib/queries"

export default async function authMiddleware(c, next) {
	const sessionId = getCookie(c, "session_id")
	
	if (!sessionId) return c.redirect("/auth")

	const session = await fetchSessionBySessionId([sessionId])

	if(!session) return c.redirect("/auth")
	
	c.set("user", session.id)

	await next()
}
