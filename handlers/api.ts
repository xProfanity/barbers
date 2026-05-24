import {Hono} from "hono"

import {fetchUserNotifications, fetchAvailableServices} from "../lib/queries.ts"
import {BELL, BELL_BADGE} from "../views/icons.ts"

import {map_services} from "../templates/map_services.ts"

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

app.get("/services", async (c) => {
	try {
		const services = await fetchAvailableServices()
		return c.html(map_services(services))
	} catch (error) {
		console.error(error)	
		return c.text("something went wrong", 500)
	}
})

app.get('/bookings-count/:count', (c) => {
	const count = parseInt(c.req.param('count'))
	switch (count) {
		case 0:
			return c.text("Nobody in line for this one!")
		case count === 1:
			return c.text(`1 person has booked this`)
		default:
			return c.text(`${count} people have booked this`)
	}
})

export default app
