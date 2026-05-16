import {Hono} from "hono"

const app = new Hono()

app.get("/", (c) => {
	const user = c.get("user")
	return c.text(user.username)
})

export default app
