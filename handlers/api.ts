import {Hono} from "hono"

import {fetchUserNotifications, fetchAvailableServices, postServiceAppointment, countAppointmentsForAService, fetchUserAppointment} from "../lib/queries.ts"
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
	const {id: user_id} = c.get("user")

	try {
		const services = await fetchAvailableServices([user_id])
		return c.html(map_services(services))
	} catch (error) {
		console.error(error)	
		return c.text("something went wrong", 500)
	}
})

app.get("/appointment", async (c) => {
	const {id: user_id} = c.get("user")
	try {
		const appointments = await fetchUserAppointment([user_id])	
		console.log("appointments", typeof appointments)
return appointments > 0 ? c.html(`<p class="caption">You have an appointment. <a hx-get="/api/appointment-details">View</a></p>`) : c.html(`<p class="caption" hx-get="/api/appointment" hx-swap="outerHTML" hx-trigger="refresh-target from:body">Are you ready to book?</p>`)
	} catch (error) {
		console.error(error)	
		return c.text("Something went wrong", 500)	
	}
})

app.get("/appointment-details", (c) => {
	c.header("HX-Redirect", "/home/appointment-details")
	return c.body(null)
})

app.get('/bookings-count/:service_id', async (c) => {
	const service_id = parseInt(c.req.param('service_id'))

	try {
		const count = await countAppointmentsForAService([service_id])
		switch (count) {
			case 0:
				return c.text("Nobody in line for this one!")
			case 1:
				return c.text(`1 person has booked this`)
			default:
				return c.text(`${count} people have booked this`)
		}
	} catch (error) {
		console.log(error)	
		return c.text("something went wrong", 500)
	}
})

app.post("/appointment", async (c) => {
	const body = await c.req.formData()
	const user = c.get("user")
	const service_id = body.get("service_id")
	try {
		const success = await postServiceAppointment([user.id, service_id])
		c.header("HX-Trigger", "refresh-target")
		return success ? c.html(`<p hx-on::load="customToast('Booked appointment successfully')">booked</p>`) : c.text("failed", 409)
	} catch (error) {
		console.error(error)	
		return c.text("failed")
	}
})

export default app
