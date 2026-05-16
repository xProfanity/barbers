import {Hono} from "hono"
import {setCookie} from "hono/cookie"
import getStaticIndexPage from "../views/index.ts"
import loginPage from "../views/login.ts"
import registerPage from "../views/register.ts"
import {fetchAuthUserByPhone, fetchIfPhoneAlreadyExist, createUserRecord, createUserSession} from "../lib/queries.ts"
import argon2 from "argon2"

const app = new Hono()

app.get("/", (c) => {
	return c.redirect("/auth/login")
})

app.get("/login", (c) => {
	return c.html(getStaticIndexPage("Barbers - Login", loginPage()))
})

app.post("/login", async (c) => {
	const body = await c.req.formData();
	const user = await fetchAuthUserByPhone(body.get("phone").replace(/^\+?265/, "0"))
	if(!user) {
		return c.text("Username and password don't match any records")
	}

	const correctPassword = await argon2.verify(user.password_hash, body.get("password"))	
	console.log(correctPassword)

	if(!correctPassword) return c.text("Forgot password much? huh?")
	
	const session = await createUserSession(body.get("phone").replace(/^\+?265/, "0"))	

	if(!session) {
		return c.text("Sorry, something went wrong (Skill issue)")
	}
	
	setCookie(c, "session_id", session.id, {
		httpOnly: true,
		secure: true,
		sameSite: "Lax",
		path: "/"
	})

	c.header("HX-Redirect", "/")
	return c.body(null)
})

app.get("/register", (c) => {
	return c.html(getStaticIndexPage("Barbers - Register", registerPage()))
})

app.post("/register", async (c) => {
	try {
		const body = await c.req.formData()
		const password = body.get("password")
		const username = body.get("username")
		const phone = body.get("phone")
		if(!password || !username || !phone) return c.text("All fields are required!")
		
		const regex = /^(?:\+?265|0)?(88|99|98|97|96|95)\d{7}$/
		if(!regex.test(phone)) return c.text("Invalid phone number")

		const alreadyExists = await fetchIfPhoneAlreadyExist(phone)

		if(alreadyExists) return c.text("Phone number provided already exist")
	
		const hashedPassword = await argon2.hash(password)

		const success = await createUserRecord([username,phone.replace(/^\+?265/, "0"),hashedPassword])

		if(!success) {
			return c.text("Something went wrong (Skill issue ngl)")	
		}	

		const session = await createUserSession(phone.replace(/^\+?265/, "0"))	

		if(!session) {
			return c.text("Sorry, something went wrong (Skill issue)")
		}

		setCookie(c, "session_id", session.id, {
			httpOnly: true,
			secure: true,
			sameSite: "Lax",
			path: "/"
		})
		
		c.header("HX-Redirect", "/")
		return c.body(null)
	} catch(err) {
		console.log(err)
		return c.text("skill issue (67)")
	}
})

export default app
