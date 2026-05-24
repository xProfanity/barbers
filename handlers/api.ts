import {Hono} from "hono"

import {fetchUserNotifications} from "../lib/queries.ts"
import {BELL, BELL_BADGE} from "../views/icons.ts"

const app = new Hono()

app.get("/", (c) => {
	return c.text("invalid endpoint")
})

app.get("/user", (c) => {
	const user = c.get("user")
	
	if (!user?.username) return c.text("Unauthorized", 401)

	const safeUsername = String(user.username)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&`#39`;")
	return c.text(safeUsername)
})

app.get("/notis", async (c) => {
	const {id: user_id} = c.get("user")

	const user_notis = await fetchUserNotifications([user_id])

	if (user_notis.length === 0) return c.html(BELL())
	
	return c.html(BELL_BADGE())
})

export default app
