import {getCookie} from "hono/cookie"

export default async function authMiddleware(c, next) {
	const sessionId = getCookie(c, "sessionId")
	
	if (!sessionId) return c.redirect("/login")

	// find session

	// if no session found redirect to login
	
	// if session found set user cookie from the session

	await next()
}
