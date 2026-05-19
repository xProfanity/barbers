import {Hono} from "hono"

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

export default app
